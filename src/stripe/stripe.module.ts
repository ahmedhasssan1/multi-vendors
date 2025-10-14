import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeResolver } from './stripe.resolver';
import { CartItemsModule } from 'src/cart_items/cart_items.module';
import { StripeController } from './stripe.controller';
import { OrdersModule } from 'src/orders/orders.module';
// import { StripeController } from './stripe.controller';
// import { sessionSataus } from './sessionstatus.controller';

@Module({
  imports:[CartItemsModule,OrdersModule],
  controllers:[StripeController],
  providers: [StripeResolver, StripeService],
})
export class StripeModule {}
