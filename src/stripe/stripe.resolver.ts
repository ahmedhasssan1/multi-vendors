import {
  Args,
  CONTEXT,
  Context,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { StripeService } from './stripe.service';
import { Request } from 'express';
import Stripe from 'stripe';
import { SessionStatusResult } from './dto/sessionStatus.dto';
import { CheckoutResponse } from './dto/res,dto';
// import { sessionSataus } from './sessionstatus.controller';
@Resolver()
export class StripeResolver {
  constructor(
    private readonly stripeService: StripeService,
    // private sessionStatus:sessionSataus
  ) {}

  @Mutation(() =>CheckoutResponse)
  async checkout(@Context() ctx: { req: Request }) {
    const session = await this.stripeService.createCheckoutSession(ctx.req);
    console.log('debugging ', session);
    const session_url=session.url;
    const session_id=session.id
    return {session_url,session_id}
  }
  @Query(() => SessionStatusResult)
  async sessionStatus(@Args('sessionId') session: string) {
    return await this.stripeService.sessiondata(session);
  }
  // @Mutation(() => Boolean)
  // async handlePaymentSuccess(
  //   @Args('paymentId') paymentId: string,
  //   @Args('amount') amount: number,
  // ) {
  //   console.log(
  //     `Processing payment success for payment ${paymentId} with amount ${amount}`,
  //   );
  //   // Your payment processing logic here
  //   // e.g., update payment record, start fulfillment process, etc.
  //   return true;
  // }

  // @Mutation(() => Boolean)
  // async handleCheckoutComplete(@Args('sessionId') sessionId: string) {
  //   console.log(`Processing checkout completion for session ${sessionId}`);
  //   // Retrieve full session details
  //   const sessionDetails = await this.stripeService.sessiondata(sessionId);

  //   // Your order fulfillment logic here
  //   // e.g., mark order as paid, send confirmation email, etc.
  //   return true;
  // }

  // @Mutation(() => Boolean)
  // async handleCheckoutExpired(@Args('sessionId') sessionId: string) {
  //   console.log(`Processing checkout expiration for session ${sessionId}`);
  //   // Your logic for handling expired checkouts
  //   // e.g., release inventory, notify customer, etc.
  //   return true;
  // }
}
