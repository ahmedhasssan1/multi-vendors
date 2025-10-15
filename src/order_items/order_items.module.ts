import { Module } from '@nestjs/common';
import { OrderItemsService } from './order_items.service';
import { OrderItemsResolver } from './order_items.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entity/order_item.entity';

@Module({
  // imports:[TypeOrmModule.forFeature([OrderItem])],
  providers: [OrderItemsResolver, OrderItemsService],
  exports:[OrderItemsService]
})
export class OrderItemsModule {}
