import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';

@Module({
  providers: [CartResolver, CartService],
})
export class CartModule {}
