import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entity/cart.entity';
import { Repository } from 'typeorm';
import { Client } from 'src/clients/entity/client.entity';
@Injectable()
export class CartService {
  constructor(@InjectRepository(Cart) private CartRepo: Repository<Cart>) {}
  async checkingCartExist(client_id: number): Promise<Cart> {
    const existingCart = await this.CartRepo.findOne({
      where: { client: { id: client_id } },
    });

    if (existingCart) return existingCart;

    return this.createCart(client_id);
  }

  async createCart(client_id: number): Promise<Cart> {
    const newCart = this.CartRepo.create({
      client: { id: client_id },
      total_price: 0,
    });
    return await this.CartRepo.save(newCart);
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
