import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeResolver } from './stripe.resolver';

@Module({
  providers: [StripeResolver, StripeService],
})
export class StripeModule {}
