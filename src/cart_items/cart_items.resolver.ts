import { Resolver } from '@nestjs/graphql';
import { CartItemsService } from './cart_items.service';

@Resolver()
export class CartItemsResolver {
  constructor(private readonly cartItemsService: CartItemsService) {}
}
