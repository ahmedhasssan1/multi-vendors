import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Order } from 'src/orders/entity/order.entity';
import { Product } from 'src/products/entity/products.entity';
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn
} from 'typeorm';


@ObjectType()
@Entity('order_items')
export class OrderItem {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(()=>Order,(order)=>order.id,{onDelete:'CASCADE'})
  @Field(() => Order)
  order: Order;

  @ManyToOne(() => Product, (p) => p.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_id' })
  @Field(() => Product)
  product: Product;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  purchase_price: number;

  @Field(() => Int)
  @Column({ type: 'int' })
  quantity: number;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
