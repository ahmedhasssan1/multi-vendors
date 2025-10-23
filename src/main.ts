import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { raw, urlencoded, json } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  const port = process.env.PORT;
  // app.use('/graphql',graphql)
  app.use('/webhook', raw({ type: 'application/json' }));

  app.use(urlencoded({ extended: true }));
  app.use(json());
  app.use(cookieParser());

  await app.listen(Number(port), () =>
    console.log(`app is running on port ${port}`),
  );
}
bootstrap();
