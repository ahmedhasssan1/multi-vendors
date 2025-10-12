// import {
//   Injectable,
//   BadRequestException,
//   NotFoundException,
// } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import Stripe from 'stripe';
// import { Request } from 'express';
// // import { OrderService } from '../order/order.service';

// @Injectable()
// export class sessionSataus {
//   private stripe: Stripe;
//   private webhookSecret: string;

//   constructor(
//     private configService: ConfigService,
//     // private orderService: OrderService,
//   ) {
//     const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY')!;
//     this.stripe = new Stripe(stripeKey);
//     this.webhookSecret = this.configService.get<string>('WEBHOOK_SECRET')!;
//   }

//   // Handle webhook events (called by the webhook controller)
//   async handlePaymentStatus(req: Request) {
//     let event: Stripe.Event;

//     try {
//       const signature = req.headers['stripe-signature'];
//       if (!signature) {
//         throw new BadRequestException('No signature provided');
//       }

//       event = this.stripe.webhooks.constructEvent(
//         req['rawBody'],
//         signature as string,
//         this.webhookSecret,
//       );
//     } catch (err) {
//       throw new BadRequestException({
//         message: 'Webhook Error',
//         error: err.message,
//       });
//     }

//     // Process the event and update payment statuses in the database
//     await this.processStripeEvent(event);

//     return { received: true };
//   }

//   // Process different event types
//   private async processStripeEvent(event: Stripe.Event) {
//     switch (event.type) {
//       case 'checkout.session.completed': {
//         const session = event.data.object as Stripe.Checkout.Session;
//         console.log(
//           `Checkout session completed with status: ${session.payment_status}`,
//         );

//         // Update order status in database
//         // await this.orderService.updateOrderBySessionId(session.id, {
//         //   status: 'processing',
//         //   paymentStatus: session.payment_status,
//         // });
//         break;
//       }

//       case 'payment_intent.succeeded': {
//         const paymentIntent = event.data.object as Stripe.PaymentIntent;
//         console.log(`Payment succeeded with status: ${paymentIntent.status}`);

//         // Update order status in database
//         // await this.orderService.updateOrderByPaymentIntentId(paymentIntent.id, {
//         //   status: 'paid',
//         //   paymentStatus: 'completed',
//         // });
//         break;
//       }

//       case 'payment_intent.payment_failed': {
//         const paymentFailed = event.data.object as Stripe.PaymentIntent;
//         console.log(`Payment failed with status: ${paymentFailed.status}`);

//         // Update order status in database
//         // await this.orderService.updateOrderByPaymentIntentId(paymentFailed.id, {
//         //   status: 'failed',
//         //   paymentStatus: 'failed',
//         //   failureReason: paymentFailed.last_payment_error?.message,
//         // });
//         break;
//       }

//       default: {
//         console.log(`Unhandled event type: ${event.type}`);
//       }
//     }
//   }

//   // Method for getting session status (will be used by GraphQL resolver)
//   async getSessionStatus(sessionId: string) {
//     try {
//       const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
//         expand: ['payment_intent'],
//       });

//       // Get associated order if needed
//       //   const order = await this.orderService.findBySessionId(sessionId);

//       return {
//         id: session.id,
//         paymentStatus: session.payment_status,
//         status: session.status,
//         amountTotal: session.amount_total ? session.amount_total / 100 : 0,
//         currency: session.currency,
//         customerEmail: session.customer_details?.email,
//         createdAt: new Date(session.created * 1000),
//       };
//     } catch (error) {
//       if (error.code === 'resource_missing') {
//         throw new NotFoundException(`Session not found: ${sessionId}`);
//       }
//       throw error;
//     }
//   }
// }
