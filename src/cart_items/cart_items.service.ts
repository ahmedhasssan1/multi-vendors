import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { QuantityDto } from './dto/updateQuantity.dto';
import { find } from 'rxjs';
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

  async decode(code: string) {
    const token = await this.jwtservice.verifyAsync(code, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    return token;
  }

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
    product.stock_quantity -= cartItem.quantity;

    await this.ProductService.saveProduct(product);
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
  async increaseCartItemQuantity(
    cartItem: QuantityDto,
    req: Request,
  ): Promise<CartItem> {
    const token = req.cookies.access_token;
    const decode = await this.decode(token);
    const client = await this.clientService.findClientByUserId(decode.sub);
    const cart = await this.cartService.findClientCart(client.id);
    const product = await this.ProductService.findProductById(
      cartItem.product_id,
    );
    if (!product) {
      throw new NotFoundException('this product not exist anymore');
    }
    const find_CartItem = await this.cartItemRepo.findOne({
      where: {
        cart: { id: cart.id },
      },
    });

    if (!find_CartItem) {
      throw new BadRequestException('this product does not exist in cart');
    }
    if (cartItem.quantity < 0) {
      const decreaseAmount = Math.abs(cartItem.quantity);

      if (find_CartItem.quantity < decreaseAmount) {
        throw new BadRequestException(
          'You cannot remove more items than exist in the cart',
        );
      }

      product.stock_quantity += decreaseAmount;
      find_CartItem.quantity -= decreaseAmount;

      await Promise.all([
        this.ProductService.saveProduct(product),
        this.cartItemRepo.save(find_CartItem),
      ]);

      cart.total_price = await this.getTotalAmount(client.id);
      await this.cartService.saveCart(cart);

      return find_CartItem;
    }

    if (product.stock_quantity - cartItem.quantity < 0) {
      throw new BadRequestException(
        'this product does not have this quantity decrease the quantity',
      );
    }
    product.stock_quantity -= cartItem.quantity;
    await this.ProductService.saveProduct(product);
    find_CartItem.quantity += cartItem.quantity;
    const totalAmount = await this.getTotalAmount(client.id);
    cart.total_price = totalAmount;
    await this.cartService.saveCart(cart);
    return await this.cartItemRepo.save(find_CartItem);
  }
}
