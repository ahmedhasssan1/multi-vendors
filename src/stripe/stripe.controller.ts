// stripe.controller.ts
import { Controller, Post, Req, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Request, Response } from 'express';
import { Context } from '@nestjs/graphql';

@Controller('webhook')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('/')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Context() ctx:{ req: Request,res: Response}) {
    return this.stripeService.handleSessionStatus(ctx.req, ctx.res);
  }
}
