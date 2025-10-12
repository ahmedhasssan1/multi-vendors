import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Request, Response } from 'express';
import { CartItemsService } from 'src/cart_items/cart_items.service';
import { error } from 'console';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private webhookSecret: string;
  constructor(
    private ConfigService: ConfigService,
    private CartItemService: CartItemsService,
  ) {
    const stripeKey = this.ConfigService.get<string>('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(stripeKey as string);
    this.webhookSecret = this.ConfigService.get<string>('WEBHOOK_SECRET')!;
  }
  async createCheckoutSession(req: Request): Promise<Stripe.Checkout.Session> {
    const cart = await this.CartItemService.getclientCartItems(req);
    if (!cart) {
      throw new NotFoundException('no cart exist with this user');
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cart.cartItems.map((item) => ({
        price_data: {
          currency: 'egp',
          unit_amount: Math.round(item.product.price * 100),
          product_data: {
            name: item.product.name,
            description: item.product.description,
          },
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      payment_method_options: {
        card: {
          setup_future_usage: 'on_session',
        },
      },
      //   saved_payment_method_options: {
      //     payment_method_remove: 'enabled',
      //   },
      phone_number_collection: {
        enabled: true,
      },
      success_url:
        'https://www.istockphoto.com/photo/businessman-using-laptop-to-online-payment-banking-and-online-shopping-financial-gm2078490118-565054317',
      cancel_url:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR3nENDzdg_967ii1-3TdUbagksG-cmyJCSw&s',
    });
    return session;
  }

  
}
