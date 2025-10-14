import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { OrderDto } from './dto/create_order.dto';

@Injectable()
export class OrdersService {
    constructor(@InjectRepository(Order) private OrderRepo:Repository<Order>){}

    async createOrder(orderInput:OrderDto):Promise<Order>{
        const order= this.OrderRepo.create(orderInput);
        return this.OrderRepo.save(order)
    }
}
