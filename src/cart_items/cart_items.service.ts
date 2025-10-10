import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entity/cart_item.entity';
import { Repository } from 'typeorm';
import { CartItemDto } from './dto/createCartItem.dto';
import { ProductsService } from 'src/products/products.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { CartService } from 'src/cart/cart.service';
import { ClientsService } from 'src/clients/clients.service';
@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
    private ProductService: ProductsService,
    private jwtservice: JwtService,
    private configService: ConfigService,
    private UserService: UsersService,
    private cartService: CartService,
    private clientService: ClientsService,
  ) {}

  async createCArtItem(cartItem: CartItemDto, req: Request) {
    const product = await this.ProductService.findProductById(
      cartItem.product_id,
    );
    const token = req.cookies?.access_token;
    if (!token) {
      throw new BadRequestException('no  token provided');
    }
    const decode = await this.jwtservice.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    const user = await this.UserService.findUserById(decode.sub);
    const findClient = await this.clientService.findClientByUserId(user.id);
    
    const total = await this.getTotalAmount(findClient.id);
    const cart_exist = await this.cartService.caheckingCartExist(
      findClient.id,
      total,
    );

    const cartItem_product_exist = await this.cartItemRepo.findOne({
      where: {
        cart: { id: cart_exist.id },
        product: { id: product.id },
      },
    });

    if (product.stock_quantity < cartItem.quantity) {
      throw new BadRequestException(
        `there is only ${product.stock_quantity} pices`,
      );
    }
    if (cartItem_product_exist) {
      cartItem_product_exist.quantity += cartItem.quantity;
      const updated = await this.cartItemRepo.save(cartItem_product_exist);
      return await this.cartItemRepo.findOne({
        where: { id: updated.id },
        relations: ['product', 'cart'],
      });
    }

    const new_cartItem = this.cartItemRepo.create({
      cart: cart_exist,
      product: product,
      quantity: cartItem.quantity,
    });
    return await this.cartItemRepo.save(new_cartItem);
  }
  async getTotalAmount(client_id: number): Promise<number> {
    const cartItems = await this.cartItemRepo.find({
      where: {
        cart: { client: { id: client_id } },
      },
      relations: ['cart', 'cart.client', 'product'],
    });

    if (!cartItems.length) return 0;

    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    return totalAmount;
  }
}
