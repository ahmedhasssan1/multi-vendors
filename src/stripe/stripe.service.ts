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
@Injectable()
export class StripeService {
  private stripe: Stripe;
  private webhookSecret: string;
  constructor(
    private ConfigService: ConfigService,
    private CartItemService: CartItemsService,
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
      mode: 'payment',
      payment_method_options: {
        card: {
          setup_future_usage: 'on_session',
        },
      },
      //   saved_payment_method_options: {
      //     payment_method_remove: 'enabled',
      //   },
      phone_number_collection: {
        enabled: true,
      },
      success_url:
        'https://www.istockphoto.com/photo/businessman-using-laptop-to-online-payment-banking-and-online-shopping-financial-gm2078490118-565054317',
      cancel_url:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR3nENDzdg_967ii1-3TdUbagksG-cmyJCSw&s',
    });
    return session;
  }

 // In your StripeService class
 async handleSessionStatus(req: Request, res: Response) {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    // req.body is a Buffer when using raw parser
    event = this.stripe.webhooks.constructEvent(
      req.body,
      signature as string,
      this.webhookSecret,
    );
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const graphqlEndpoint = `http://localhost:3000/graphql`;

  try {
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
        
        // Call GraphQL endpoint for payment_intent.succeeded
        await fetch(graphqlEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              mutation HandlePaymentSuccess($paymentId: String!, $amount: Float!) {
                handlePaymentSuccess(paymentId: $paymentId, amount: $amount)
              }
            `,
            variables: {
              paymentId: paymentIntent.id,
              amount: paymentIntent.amount / 100,
            }
          })
        });
        break;
        
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Received checkout.session.completed for session:', session.id);
        
        // Call GraphQL endpoint for checkout.session.completed
        await fetch(graphqlEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              mutation HandleCheckoutComplete($sessionId: String!) {
                handleCheckoutComplete(sessionId: $sessionId)
              }
            `,
            variables: {
              sessionId: session.id,
            }
          })
        });
        break;

      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        console.log('Payment method attached:', paymentMethod.id);
        break;
        
      case 'checkout.session.expired':
        const expiredSession = event.data.object;
        console.log(`Checkout session expired: ${expiredSession.id}`);
        
        // Call GraphQL endpoint for checkout.session.expired
        await fetch(graphqlEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              mutation HandleCheckoutExpired($sessionId: String!) {
                handleCheckoutExpired(sessionId: $sessionId)
              }
            `,
            variables: {
              sessionId: expiredSession.id,
            }
          })
        });
        break;

      default:
        console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).send({ received: true });
  } catch (error) {
    console.error('Error processing webhook or calling GraphQL:', error);
    // Still return 200 to Stripe to prevent retries if it's our internal error
    res.status(200).send({ received: true, error: error.message });
  }
}
  async sessiondata(sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });
    console.log("deb=ug ",session)
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
