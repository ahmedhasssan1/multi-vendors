import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { raw, urlencoded, json } from 'express';
import * as dotenv from 'dotenv';
import { Transport } from '@nestjs/microservices';
dotenv.config();
async function bootstrap() {
   const app = await NestFactory.create(AppModule, { bodyParser: false });
  const port = process.env.PORT ;

  // Attach microservice
  app.connectMicroservice({
    transport: Transport.TCP,
    options: { host: '0.0.0.0', port: 8877 },
  });

  app.use('/webhook', raw({ type: 'application/json' }));
  app.use(urlencoded({ extended: true }));
  app.use(json());
  app.use(cookieParser());

  await app.startAllMicroservices();
  await app.listen(Number(port));

  console.log(`HTTP app is running on port ${port}`);
  console.log(`Microservice listening on TCP port 8877`);
  
}
bootstrap();
