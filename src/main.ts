import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port=process.env.PORT;
  await app.listen(Number(process.env.PORT),()=>console.log(`app is running om port ${port}`));
}
bootstrap();
