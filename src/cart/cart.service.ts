import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entity/cart.entity';
import { Repository } from 'typeorm';
import { Client } from 'src/clients/entity/client.entity';
@Injectable()
export class CartService {
  constructor(@InjectRepository(Cart) private CartRepo: Repository<Cart>) {}
  async caheckingCartExist(
    client_id: number,
    total_amount: number,
  ): Promise<Cart> {
    const cart_exist = await this.CartRepo.findOne({
      where: { client: { id: client_id } },
    });

    if (cart_exist) {
      cart_exist.total_price = total_amount;
      return await this.CartRepo.save(cart_exist);
    }
    return await this.createCart(client_id, total_amount);
  }
  async createCart(client_id: number, total: number): Promise<Cart> {
    const new_cart = this.CartRepo.create({
      client: { id: client_id },
    });
    new_cart.total_price = total;
    return await this.CartRepo.save(new_cart);
  }
  async findClientCart(id: number): Promise<Cart> {
    const cart = await this.CartRepo.findOne({
      where: {
        client: { id },
      },
    });
    if (!cart) {
      throw new NotFoundException('this client does not have cart');
    }
    return cart;
  }
  async saveCart(Cart: Cart): Promise<Cart> {
    const cart = await this.CartRepo.save(Cart);
    return cart;
  }
}
