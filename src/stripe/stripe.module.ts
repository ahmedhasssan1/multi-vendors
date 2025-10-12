import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeResolver } from './stripe.resolver';
import { CartItemsModule } from 'src/cart_items/cart_items.module';

@Module({
  imports:[CartItemsModule],
  providers: [StripeResolver, StripeService],
})
export class StripeModule {}
