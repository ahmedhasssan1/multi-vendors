import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Cart } from 'src/cart/entity/cart.entity';
import { OrderItem } from 'src/order_items/entity/order_item.entity';
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';


@ObjectType()
@Entity('orders')
export class Order {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

   @Column()
  @Field(()=>Int)
  cart_id: number
  ;

  @Field()
  @Column({ length: 20 })
  order_status: string;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total: string;

  @Field()
  @Column({ length: 255 })
  shipping_address: string;

  @Field()
  @Column({ length: 50 })
  payment_method: string;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;


}
