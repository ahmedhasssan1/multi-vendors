import { Resolver } from '@nestjs/graphql';
import { OrderItemsService } from './order_items.service';

@Resolver()
export class OrderItemsResolver {
  constructor(private readonly orderItemsService: OrderItemsService) {}
}
