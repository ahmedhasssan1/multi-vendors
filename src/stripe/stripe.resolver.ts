import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StripeService } from './stripe.service';
import { Request } from 'express';
import Stripe from 'stripe';
import { SessionStatusResult } from './dto/sessionStatus.dto';
// import { sessionSataus } from './sessionstatus.controller';
@Resolver()
export class StripeResolver {
  constructor(private readonly stripeService: StripeService,
    // private sessionStatus:sessionSataus
  ) {}
  @Mutation(() => String)
  async checkout(@Context() ctx: { req: Request }) {
    const session = await this.stripeService.createCheckoutSession(ctx.req);
    console.log('debugging ', session);

    return session.url;
  }
  @Query(()=>SessionStatusResult)
  async sessionStatus(@Args("sessionId")session:string){
    return await this.stripeService.sessiondata(session)
  }
  
}
