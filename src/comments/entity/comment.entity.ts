import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Client } from 'src/clients/entity/client.entity';
import { Product } from 'src/products/entity/products.entity';
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn
} from 'typeorm';


@ObjectType()
@Entity('comments')
export class Comment {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(()=>Client,(cleint)=>cleint.id,{onDelete:"CASCADE"})
  @Field(()=>Client)
  author: Client;

  @ManyToOne(() => Product, (p) => p.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  @Field(() => Product)
  product: Product;

  @Field()
  @Column({ type: 'text' })
  content: string;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
