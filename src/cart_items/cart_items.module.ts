import { Module } from '@nestjs/common';
import { CartItemsService } from './cart_items.service';
import { CartItemsResolver } from './cart_items.resolver';
import { TypeORMError } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entity/cart_item.entity';
import { ProductsModule } from 'src/products/products.module';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { CartModule } from 'src/cart/cart.module';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItem]),
    ProductsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions:{expiresIn:"2m  "}
    }),
    CartModule,
    UsersModule,
    ClientsModule
  ],
  providers: [CartItemsResolver, CartItemsService],
  exports:[CartItemsService]
})
export class CartItemsModule {}
