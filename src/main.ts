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



  // Correctly configure the webhook endpoint with raw body parser
  app.use('/webhook', raw({ type: 'application/json' }));

  // Configure parsers for other routes
  app.use(urlencoded({ extended: true }));
  app.use(json());
  app.use(cookieParser());

  await app.listen(Number(port), () =>
    console.log(`app is running on port ${port}`),
  );
}
bootstrap();
