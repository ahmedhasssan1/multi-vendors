import { Resolver } from '@nestjs/graphql';
import { StripeService } from './stripe.service';

@Resolver()
export class StripeResolver {
  constructor(private readonly stripeService: StripeService) {}
}
