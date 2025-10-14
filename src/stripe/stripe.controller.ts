// stripe.controller.ts
import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Request, Response } from 'express';
import { Public } from 'src/auth/guard/jwtGuard';

@Controller('webhook')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Public()
  @Post('/')
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const session = await this.stripeService.handleWebhookEvents(req,res);
    return session
  }
}
