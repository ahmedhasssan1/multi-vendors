import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Request } from 'express';
import { CartItemsService } from 'src/cart_items/cart_items.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(
    private ConfigService: ConfigService,
    private CartItemService: CartItemsService,
  ) {
    const stripeKey = this.ConfigService.get<string>('STRIPE_SECRET_KEY');

    this.stripe = new Stripe(stripeKey as string);
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
      saved_payment_method_options: {
        payment_method_remove: 'enabled',
        payment_method_save: 'enabled',
      },
      success_url:
        'https://www.istockphoto.com/photo/businessman-using-laptop-to-online-payment-banking-and-online-shopping-financial-gm2078490118-565054317',
      cancel_url:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR3nENDzdg_967ii1-3TdUbagksG-cmyJCSw&s',
    });
    return session;
  }
}
