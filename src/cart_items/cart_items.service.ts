import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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

  async createCartItem(cartItem: CartItemDto, req: Request) {
    const token = req.cookies?.access_token;
    if (!token) throw new BadRequestException('No token provided');

    const decoded = await this.decode(token);
    const user = await this.UserService.findUserById(decoded.sub);
    const client = await this.clientService.findClientByUserId(user.id);

    const product = await this.ProductService.findProductById(
      cartItem.product_id,
    );
    if (!product) throw new NotFoundException('Product not found');

    if (product.stock_quantity < cartItem.quantity) {
      throw new BadRequestException(
        `Only ${product.stock_quantity} pieces available`,
      );
    }

    const cart = await this.cartService.checkingCartExist(client.id);

    let cartItemEntity = await this.cartItemRepo.findOne({
      where: {
        cart: { id: cart.id },
        product: { id: product.id },
      },
    });

    product.stock_quantity -= cartItem.quantity;
    await this.ProductService.saveProduct(product);

    if (cartItemEntity) {
      cartItemEntity.quantity += cartItem.quantity;
      await this.cartItemRepo.save(cartItemEntity);
    } else {
      cartItemEntity = this.cartItemRepo.create({
        cart,
        product,
        quantity: cartItem.quantity,
      });
      await this.cartItemRepo.save(cartItemEntity);
    }

    // Update total price after all changes
    const total = await this.getTotalAmount(client.id);
    cart.total_price = total;
    await this.cartService.saveCart(cart);

    return await this.cartItemRepo.findOne({
      where: { id: cartItemEntity.id },
      relations: ['product', 'cart'],
    });
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
  async updateCartItemQuantity(
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

    const find_CartItem = await this.cartItemRepo.findOne({
      where: {
        cart: { id: cart.id },
        product: { id: cartItem.product_id },
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
    find_CartItem.quantity += cartItem.quantity;
    await Promise.all([
      this.ProductService.saveProduct(product),
      this.cartItemRepo.save(find_CartItem),
    ]);
    const totalAmount = await this.getTotalAmount(client.id);
    cart.total_price = totalAmount;
    await this.cartService.saveCart(cart);
    return find_CartItem;
  }
  async deleteCartItem(productId: number, req: Request) {
    const token = req.cookies.access_token;
    const decode = await this.decode(token);
    const client = await this.clientService.findClientByUserId(decode.sub);
    const cart = await this.cartService.findClientCart(client.id);
    const product = await this.ProductService.findProductById(productId);
    const cart_item = await this.cartItemRepo.findOne({
      where: {
        product: { id: productId },
        cart: { id: cart.id },
      },
    });
    if (!cart_item) {
      throw new UnauthorizedException('this product not exist in ypur cart');
    }
    await this.cartItemRepo.remove(cart_item);
    const total = await this.getTotalAmount(client.id);
    cart.total_price = total;
    await this.cartService.saveCart(cart);
    return 'the product deleted from cart';
  }
  async getclientCartItems(req: Request) {
    const token = req.cookies.access_token;
    if (!token) {
      throw new NotFoundException('nottoken provided please login in');
    }
    const decode = await this.decode(token);

    const client = await this.clientService.findClientByUserId(decode.sub);
    if (!client) {
      throw new NotFoundException('this client not exist');
    }
    const cart = await this.cartService.findClientCart(client.id);
    const cartItems = await this.cartItemRepo.find({
      where: {
        cart: { id: cart.id },
      },relations:["product"]
    });
    if (cartItems.length < 1) {
      throw new NotFoundException('no producted added');
    }
    
    const total_price = cart.total_price;
    return { total_price, cartItems };
  }
}
