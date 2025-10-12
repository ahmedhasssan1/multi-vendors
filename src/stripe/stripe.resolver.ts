import { Context, Mutation, Resolver } from '@nestjs/graphql';
import { StripeService } from './stripe.service';
import {Request} from "express"
import Stripe from 'stripe';
@Resolver()
export class StripeResolver {
  constructor(private readonly stripeService: StripeService) {}
  @Mutation(()=>String)
  async checkout(@Context() ctx:{req:Request}){
    const session= await this.stripeService.createCheckoutSession(ctx.req)
    return session.url
  }
}
