import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { raw, urlencoded } from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT;
    app.use(urlencoded({ extended: true }));

  app.use('/webhook', raw({ type: 'application/json' }));
  app.use(cookieParser());

  await app.listen(Number(process.env.PORT), () =>
    console.log(`app is running om port ${port}`),
  );
}
bootstrap();
