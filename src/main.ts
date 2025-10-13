import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { raw, urlencoded, json } from 'express';
import { BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import * as dotenv from 'dotenv';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  const port = process.env.PORT;

  // Define your stripe instance and webhook secret
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const webhookSecret = process.env.WEBHOOK_SECRET as string;

  // Correctly configure the webhook endpoint with raw body parser
  app.use('/webhook', raw({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['stripe-signature'];
    let event;

    // console.log('debugging signature: ', signature);

    try {
      // req.body is a Buffer when using raw parser
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret,
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const graphqlEndpoint = `http://localhost:3000/graphql`;

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        console.log(' Received checkout.session.completed');

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(
          `PaymentIntent for ${paymentIntent.amount_total} was successful!`,
        );
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;

      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        console.log('Payment method attached:', paymentMethod.id);
        break;
      case ' checkout.session.expired':
        console.log(`checkout expired4 `);

      case 'checkout.session.expired':
        const expiredSession = event.data.object;
        console.log(`Checkout session expired: ${expiredSession.id}`);
        break;
      case 'charge.updated':
        const charge = event.data.object;
        console.log(`charge update ${charge.id}`);

      case 'payment_intent.created':
        const payment_created = event.data.object;
        console.log(`charge created ${payment_created.id}`);
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).send({ received: true });
  });

  // Configure parsers for other routes
  app.use(urlencoded({ extended: true }));
  app.use(json());
  app.use(cookieParser());

  await app.listen(Number(port), () =>
    console.log(`app is running on port ${port}`),
  );
}
bootstrap();
