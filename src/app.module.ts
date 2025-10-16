import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StripeModule } from './stripe/stripe.module';
import { UsersModule } from './users/users.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { VendorsModule } from './vendors/vendors.module';
import { FollowersModule } from './followers/followers.module';
import { ClientsModule } from './clients/clients.module';
import { ProductsModule } from './products/products.module';
import { CommentsModule } from './comments/comments.module';
import { CartModule } from './cart/cart.module';
import { CartItemsModule } from './cart_items/cart_items.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order_items/order_items.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppResolver } from './app.resolver';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from './redis/redis.module';
import { JwtGuard } from './auth/guard/jwtGuard';
import { APP_GUARD } from '@nestjs/core';
import { BullModule } from '@nestjs/bullmq';
import { BullmqModule } from './bullmq/bullmq.module';
import { EmailModule } from './email/email.module';
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res }) => ({ req, res }),
      graphiql: true,
      playground: false,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot("main_queue",{
      connection:{
         host:process.env.REDIS_HOST,
         port:6379
      }
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    StripeModule,
    UsersModule,
    SuperAdminModule,
    VendorsModule,
    FollowersModule,
    ClientsModule,
    ProductsModule,
    CommentsModule,
    CartModule,
    CartItemsModule,
    OrdersModule,
    OrderItemsModule,
    RedisModule,
    BullmqModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppResolver,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
