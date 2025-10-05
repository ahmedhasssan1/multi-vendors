import { Module } from '@nestjs/common';
import { OrderItemsService } from './order_items.service';
import { OrderItemsResolver } from './order_items.resolver';

@Module({
  providers: [OrderItemsResolver, OrderItemsService],
})
export class OrderItemsModule {}
