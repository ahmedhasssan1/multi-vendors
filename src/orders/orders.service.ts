import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import {Request} from "express"
import { CartItemsService } from 'src/cart_items/cart_items.service';
import {  StripeService } from 'src/stripe/stripe.service';
import { ClientsService } from 'src/clients/clients.service';
import { OrderItem } from 'src/order_items/entity/order_item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private OrderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private OrderItemRepo:Repository<OrderItem>,
    private cartItemsService: CartItemsService,
    // private stripeService: StripeService,
    private clientService: ClientsService,
  ) {}

  // order.service.ts
  async createOrderFromCart(paymentIntent: any,email:string,) {

    const client=await this.clientService.findUserByEmail(email);
    if(!client){
      throw new NotFoundException("mo client with this id")
    } 
    console.log('debugging client',client.id);
    
    
    const cartItems=await this.cartItemsService.getClientItemsById(client.id)
    
    console.log('debugging 2',cartItems);
    const order = this.OrderRepo.create({
      stripe_payment_intent_id: paymentIntent.id,
      total_amount: paymentIntent.amount ,
      status: 'PAID',
      client:client,
      customer_name: paymentIntent.shipping?.name,
      address_line1: paymentIntent.shipping?.address?.line1,
      city: paymentIntent.shipping?.address?.city,
      country: paymentIntent.shipping?.address?.country,
    });

    const savedOrder = await this.OrderRepo.save(order);
     const cartItem=cartItems.map((item) =>
      this.OrderItemRepo.create({
        order:savedOrder,
        product: item.product,
        quantity: item.quantity,
        purchase_price: item.product.price,
      }),
    );

    await this.OrderItemRepo.save(cartItem)
    // Optionally clear the cart after payment

    return savedOrder;
  }
}
