import { forwardRef, Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeResolver } from './stripe.resolver';
import { CartItemsModule } from 'src/cart_items/cart_items.module';
import { StripeController } from './stripe.controller';
import { OrdersModule } from 'src/orders/orders.module';
import { OrdersService } from 'src/orders/orders.service';
// import { StripeController } from './stripe.controller';
// import { sessionSataus } from './sessionstatus.controller';

@Module({
  imports:[CartItemsModule,forwardRef(()=>OrdersModule) ],
  controllers:[StripeController],
  providers: [StripeResolver, StripeService],
  exports:[StripeService]
})
export class StripeModule {}
