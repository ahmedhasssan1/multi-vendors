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
  async createOrderFromCart(paymentIntent: any, email: string,phone:string) {
    const client = await this.clientService.findUserByEmail(email);
    if (!client) {
      throw new NotFoundException('mo client with this id');
    }

    const cartItems = await this.cartItemsService.getClientItemsById(client.id);
    console.log('debugging pgone dfrom service',phone);
    
    const order = this.OrderRepo.create({
      stripe_payment_intent_id: paymentIntent.id,
      total_amount: paymentIntent.amount,
      status: 'PAID',
      client: client, 
      phone:phone,
      customer_name: paymentIntent.shipping?.name,
      address_line1: paymentIntent.shipping?.address?.line1,
      city: paymentIntent.shipping?.address?.city,
      country: paymentIntent.shipping?.address?.country,
    });

    const savedOrder = await this.OrderRepo.save(order);
    const cartItem = cartItems.map((item) =>
      this.OrderItemRepo.create({
        order: savedOrder,
        product: item.product,
        quantity: item.quantity,
        purchase_price: item.product.price,
      }),
    );

    for (const item of cartItems) {
      const vendor = await this.vendoeService.findVendorById(item.product.vendor_id);
      vendor.number_of_purchases++;
      await this.vendoeService.saveVendor(vendor);
      item.product.number_of_purchases += item.quantity;
      await this.productService.saveProduct(item.product);
    }

    await this.OrderItemRepo.save(cartItem);
    //  clear the cart after payment

    console.log('debugging s=orderServie');
    await this.BullmqService.handleEmailSending(
      client.email,
      String(savedOrder.id),
    );

    return savedOrder;
  }
}
