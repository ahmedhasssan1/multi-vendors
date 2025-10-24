import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { CartItemsService } from 'src/cart_items/cart_items.service';
import { StripeService } from 'src/stripe/stripe.service';
import { ClientsService } from 'src/clients/clients.service';
import { OrderItem } from 'src/order_items/entity/order_item.entity';
import { bullmqService } from 'src/bullmq/bullmq.service';
import { ProductsService } from 'src/products/products.service';
import { VendorsService } from 'src/vendors/vendors.service';
import { CartItem } from 'src/cart_items/entity/cart_item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private OrderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private OrderItemRepo: Repository<OrderItem>,
    private cartItemsService: CartItemsService,
    private clientService: ClientsService,
    private BullmqService: bullmqService,
    private productService: ProductsService,
    private vendoeService: VendorsService,
  ) {}

  // order.service.ts
  async createOrderFromCart(paymentIntent: any, email: string, phone: string) {
    const client = await this.clientService.findUserByEmail(email);
    if (!client) {
      throw new NotFoundException('mo client with this id');
    }
    console.log('Saving order with payment intent:', paymentIntent.id || paymentIntent);

    const cartItems = await this.cartItemsService.getClientItemsById(client.id);
    
    const order = this.OrderRepo.create({
      stripe_payment_intent_id: paymentIntent.id,
      total_amount: paymentIntent.amount,
      status: 'PAID',
      client: client,
      phone,
      customer_name: paymentIntent.shipping?.name,
      address_line1: paymentIntent.shipping?.address?.line1,
      city: paymentIntent.shipping?.address?.city,
      country: paymentIntent.shipping?.address?.country,
    });
    
    
    const savedOrder = await this.OrderRepo.save(order);
    console.log('Saved order:', savedOrder);

    await this.createOrderItemrepo(cartItems, savedOrder);

    //  clear the cart after payment just leave it as test !!

    await this.BullmqService.handleEmailSending(
      client.email,
      String(savedOrder.id),
    );

    return savedOrder;
  }
  async createOrderItemrepo(
    cartItem: CartItem[],
    order: Order,
  ): Promise<CartItem[]> {
    const orderItems = await Promise.all(
      cartItem.map(async (item) => {
        const orderItem = this.OrderItemRepo.create({
          product: item.product,
          quantity: item.quantity,
          order: order,
        });
      }),
    );
    for (const item of cartItem) {
      const vendor = await this.vendoeService.findVendorById(
        item.product.vendor_id,
      );
      vendor.number_of_purchases++;
      await this.vendoeService.saveVendor(vendor);
      item.product.number_of_purchases += item.quantity;
      await this.productService.saveProduct(item.product);
    }
    console.log('debugging orderItemsService');

    return await this.OrderItemRepo.save(cartItem);
  }
  async findById(id:number):Promise<Order>{
    const order=await this.OrderRepo.findOne({
      where:{id}
    })
    if(!order){
      throw new NotFoundException("this order not exist ")
    }
    return order
  }
  async findByPaymentId(paymentId:string):Promise<Order>{
    const order=await this.OrderRepo.findOne({
      where:{
        stripe_payment_intent_id:paymentId
      }
    })
    if(!order){
      console.log('debugging order ewxist from stripe service',order);
      throw new NotFoundException("no order exist with this payment id")
    }
    return order  
  }
}
