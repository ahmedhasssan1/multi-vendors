import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entity/cart.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Cart])],
  providers: [CartResolver, CartService],
  exports:[CartService]
})
export class CartModule {}
