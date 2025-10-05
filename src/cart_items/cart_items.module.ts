import { Module } from '@nestjs/common';
import { CartItemsService } from './cart_items.service';
import { CartItemsResolver } from './cart_items.resolver';

@Module({
  providers: [CartItemsResolver, CartItemsService],
})
export class CartItemsModule {}
