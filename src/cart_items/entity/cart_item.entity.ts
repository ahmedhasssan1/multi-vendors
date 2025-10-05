import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Cart } from 'src/cart/entity/cart.entity';
import { Product } from 'src/products/entity/products.entity';
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn
} from 'typeorm';


@ObjectType()
@Entity('cart_items')
export class CartItem {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field(()=>Int)
  cart_id: number;

  @ManyToOne(() => Product, (p) => p.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_id' })
  @Field(() => Product)
  product: Product;

  @Field(() => Int)
  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
