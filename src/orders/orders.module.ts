import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { CartItemsModule } from 'src/cart_items/cart_items.module';
import { StripeModule } from 'src/stripe/stripe.module';
import { ClientsModule } from 'src/clients/clients.module';
import { OrderItem } from 'src/order_items/entity/order_item.entity';
import { BullmqModule } from 'src/bullmq/bullmq.module';
import { ProductsModule } from 'src/products/products.module';
import { VendorsModule } from 'src/vendors/vendors.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    CartItemsModule,
    BullmqModule,
    ClientsModule,
    ProductsModule,
    VendorsModule
  ],
  providers: [OrdersResolver, OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
