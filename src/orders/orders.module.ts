import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Order])],
  providers: [OrdersResolver, OrdersService],
  exports:[OrdersService]
})
export class OrdersModule {}
