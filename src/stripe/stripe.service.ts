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
import { NoUnusedFragmentsRule } from 'graphql';
import { OrdersService } from 'src/orders/orders.service';
import { json } from 'body-parser';
import { promiseHooks } from 'v8';
import { eventNames } from 'process';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private webhookSecret: string;
  constructor(
    private ConfigService: ConfigService,
    private CartItemService: CartItemsService,
    private OrderServive: OrdersService,
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

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cart.cartItems.map((item) => ({
        price_data: {
          currency: 'egp',
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
        setup_future_usage: 'on_session',
      },
      // payment_method_options: {
      //   card: {
      //     setup_future_usage: 'on_session',
      //   },
      // },
      shipping_address_collection: {
        allowed_countries: ['EG'],
      },
      metadata: {
        client_email: cart.client_email,
      },

      phone_number_collection: {
        enabled: true,
      },
      success_url: 'https://www.shutterstock.com/shutterstock/videos/3848004751/thumb/7.jpg?ip=x480',
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
        console.log(' Received checkout.sessson.completed');
        const session = event.data.object as Stripe.Checkout.Session;
        // Access phone number directly from session if available
        const paymentIntent2 = session.payment_intent;
        const phoneNumber = session.customer_details?.phone as string;
        const email = session.customer_details?.email as string;
     

        await this.OrderServive.createOrderFromCart(
          paymentIntent2,
          email,
          phoneNumber ,
        );
        console.log('order palced ');
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;

        console.log('paymenyt intent successfully ');

        break;

      case 'payment_method.attached':
        const paymentMethod = event.data.object as Stripe.PaymentMethod;
        console.log(` Payment method attached: ${paymentMethod.id}`);
        break;

      case 'charge.refunded':
        const chargeRefund = event.data.object;
        console.log('refund phase ');
        break;

      case 'checkout.session.expired':
        const expiredSession = event.data.object as Stripe.Checkout.Session;
        console.log(` Checkout session expired: ${expiredSession.id}`);
        break;

      case 'charge.succeeded':
        const chargeSuccess = event.data.object as Stripe.Charge;
        console.log('chargesucess', chargeSuccess);

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
        card_payments: {requested: true},
        transfers: {requested: true},
      },
      business_type: vendorData.business_type, // 'individual' or 'company'
      business_profile: {
        name: vendorData.business_name,
        url: vendorData.website,
      },
      metadata: {
        vendor_id: vendorData.vendorId // Store reference to your system's vendor ID
      }
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
      onboardingUrl: accountLink.url
    };
  } catch (error) {
    throw new BadRequestException(`Failed to create vendor account: ${error.message}`);
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
