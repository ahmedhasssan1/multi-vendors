import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Request, Response } from 'express';
import { CartItemsService } from 'src/cart_items/cart_items.service';
import * as dotenv from 'dotenv';
import { OrdersService } from 'src/orders/orders.service';
import { WalletService } from 'src/wallet/wallet.service';
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private webhookSecret: string;
  constructor(
    private ConfigService: ConfigService,
    private CartItemService: CartItemsService,
    private OrderServive: OrdersService,
    private walletService: WalletService,
    private transactionsService: TransactionsService,
    // private vendorService:VendorsService
  ) {
    const stripeKey = this.ConfigService.get<string>('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(stripeKey as string);
    this.webhookSecret = this.ConfigService.get<string>('WEBHOOK_SECRET')!;
  }
  async createCheckoutSession(req: Request): Promise<Stripe.Checkout.Session> {
    const cart = await this.CartItemService.getclientCartItems(req);
    if (!cart) {
      throw new NotFoundException('no cart exist with this user');
    }
    const vendorId = cart.cartItems[0].product.vendor_id;

    const stripeacc = await this.walletService.findOneByVendorId(vendorId);

    // const platformFeePercent = 0.10;
    console.log('debugging  vendor id', vendorId);
    console.log('debugging  vendor stripe', stripeacc);

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cart.cartItems.map((item) => ({
        price_data: {
          currency: 'USD',
          unit_amount: Math.round(item.product.price * 100),
          product_data: {
            name: item.product.name,
            description: item.product.description,
          },
        },

        quantity: item.quantity,
      })),

      expand: ['customer'],
      customer_email: cart.client_email,
      mode: 'payment',
      payment_intent_data: {
        transfer_data: {
          destination: stripeacc,
        },
      },

      shipping_address_collection: {
        allowed_countries: ['EG'],
      },
      metadata: {
        client_email: cart.client_email,
      },

      phone_number_collection: {
        enabled: true,
      },
      success_url:
        'https://www.shutterstock.com/shutterstock/videos/3848004751/thumb/7.jpg?ip=x480',
      cancel_url:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR3nENDzdg_967ii1-3TdUbagksG-cmyJCSw&s',
    });
    return session;
  }

  async handleWebhookEvents(req: Request, res: Response) {
    const signature = req.headers['stripe-signature'];

    let event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.body,
        signature as string,
        this.webhookSecret,
      );
    } catch (err) {
      console.error(`⚠️ Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        const paymentIntentId = session.payment_intent as string;

        console.log('✅ Received checkout.session.completed event');

        // Retrieve full payment intent
        const payment_intent =
          await this.stripe.paymentIntents.retrieve(paymentIntentId);

        // Get connected account destination
        const destination = payment_intent.transfer_data?.destination;
        const wallet_vendor2 = await this.walletService.findStripeAccountId(
          destination as string,
        );

        if (!wallet_vendor2) {
          console.log(' Vendor not found for connected account:', destination);
        } else {
          console.log(' Found vendor for connected account:', destination);
        }

        console.log('debugging vendorrrrr Id', wallet_vendor2?.id);
        // Determine the best email to use (try multiple sources)
        let customerEmail = '';

        // Options: checking where is email

        if (session.customer_details?.email) {
          customerEmail = session.customer_details.email;
        } else if (payment_intent.metadata?.client_email) {
          customerEmail = payment_intent.metadata.client_email;
        } else if (session.metadata?.client_email) {
          customerEmail = session.metadata.client_email;
        } else if (payment_intent.receipt_email) {
          customerEmail = payment_intent.receipt_email;
        }

        console.log('Using customer email:', customerEmail);

        // Create order from cart
        const order = await this.OrderServive.createOrderFromCart(
          payment_intent,
          customerEmail,
        );

        const amount2 = payment_intent.amount_received;
        const commission = amount2 * 0.1;

        // Process the vendor payment after a delay
        setTimeout(async () => {
          try {
            const order2 = await this.OrderServive.findByPaymentId(
              payment_intent.id,
            );

            if (!order2) {
              console.log('⚠️ Order not found after delay');
              return;
            }

            const vendorId = wallet_vendor2?.vendor.id as number;
            const amount = Number(order2.total_amount);
            const transaction = await this.walletService.processSaleTransaction(
              order2.id,
              vendorId,
              amount,
              commission,
              payment_intent.id,
            );

            console.log('✅ Transaction processed:', transaction?.id);
          } catch (error) {
            console.error('❌ Error in delayed processing:', error);
          }
        }, 3000);

        console.log(
          '🧾 Order creation initiated for payment:',
          payment_intent.id,
        );
        break;

      case 'payment_intent.succeeded':
        const paymentIntent2 = event.data.object as Stripe.PaymentIntent;
        console.log('Payment intent succeeded:', paymentIntent2);

        const order3 = await this.OrderServive.findByPaymentId(
          paymentIntent2.id,
        );
        console.log('Found order3:', order3?.id);

        // Get vendorId and amount from your order or its items
        //  Create the order record in your DB
        const email = paymentIntent2.receipt_email as string;
        // const phone=paymentIntent2.de

        await this.OrderServive.createOrderFromCart(paymentIntent2.id, email);

        break;

      case 'payment_method.attached':
        const paymentMethod = event.data.object as Stripe.PaymentMethod;
        console.log(` Payment method attached:`);
        break;

      case 'charge.refunded':
        const chargeRefund = event.data.object;
        console.log('refund phase ');
        break;

      case 'checkout.session.expired':
        const expiredSession = event.data.object as Stripe.Checkout.Session;
        console.log(` Checkout session expired:`);
        break;

      case 'charge.succeeded':
        const charge = event.data.object as Stripe.Charge;

        if (charge.transfer_data?.destination) {
          const vendor = await this.walletService.findStripeAccountId(
            charge.transfer_data.destination as string,
          );
        }
        break;

      case 'transfer.failed':
        const transfer = event.data.object as Stripe.Transfer;
        // Find vendor by Stripe account ID
        const vendor = await this.walletService.findStripeAccountId(
          transfer.destination as string,
        );

        if (vendor) {
          const transaction =
            await this.transactionsService.findoneByStripeTransferId(
              transfer.id,
            );

          if (transaction) {
            await this.walletService.updateTransactionStatus(
              transaction.id,
              (transfer as any).status === 'paid' ? 'completed' : 'pending',
            );
          }

          // Sync wallet balance
          await this.walletService.syncWalletWithStripe(vendor.id);
        }

        break;

      case 'balance.available':
        if (event.account) {
          // Find vendor by Stripe account ID
          const vendor = await this.walletService.findStripeAccountId(
            event.account,
          );

          if (vendor) {
            // Sync wallet balance
            await this.walletService.syncWalletWithStripe(vendor.id);
          }
        }
        break;
      case 'charge.updated':
        const chargeUpdated = event.data.object as Stripe.Charge;
        console.log(` Charge updated: ${chargeUpdated.id}`);
        break;

      case 'payment_intent.created':
        const paymentCreated = event.data.object as Stripe.PaymentIntent;
        console.log(` PaymentIntent created: ${paymentCreated.id}`);
        break;
      case 'stripe.charges.retrieve':
        console.log('inside stripe.charge');
        break;

      default:
        console.log(` Unhandled event type: ${event.type}`);
    }

    //  Return a response to acknowledge receipt of the event
    res.status(200).send({ received: true });

    // process.nextTick(()=>{
    //   this.handleEvent(event)
    // })
  }
  async refund(payment_intentId: string) {
    const refund = await this.stripe.refunds.create({
      payment_intent: payment_intentId,
    });
    return `refund done: ${refund.amount} `;
  }

  async createVendorAccount(vendorData) {
    try {
      // Create a Standard or Express connected account
      const account = await this.stripe.accounts.create({
        type: 'standard',
        country: vendorData.country,
        email: vendorData.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: vendorData.business_type,
        business_profile: {
          name: vendorData.business_name,
          url: vendorData.website,
        },
        metadata: {
          vendor_id: vendorData.vendorId,
        },
      });

      // For Standard accounts, create an account link for onboarding
      const accountLink = await this.stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${process.env.YOUR_DOMAIN}/vendor/onboarding/refresh`,
        return_url: `${process.env.YOUR_DOMAIN}/vendor/onboarding/complete`,
        type: 'account_onboarding',
      });

      return {
        accountId: account.id,
        onboardingUrl: accountLink.url,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to create vendor account: ${error.message}`,
      );
    }
  }

  async sessiondata(sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });
    const payment_intent = session.payment_intent as Stripe.PaymentIntent;
    if (!payment_intent || payment_intent.latest_charge) {
      return {
        charge_id: null,
        session_staus: session.status,
        customer_email: session.customer_details?.email,
        message: 'no ccharge id',
      };
    }
    const charge = await this.stripe.charges.retrieve(
      payment_intent.latest_charge as string,
    );
    return {
      charge_id: charge.id,
      status: session.payment_status,
      customer_email: session.customer_details?.email,
      amount_total: (session.amount_total ?? 0) / 100,
    };
  }
}
