import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Vendor } from 'src/vendors/entity/vendors.entity';
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn
} from 'typeorm';

@ObjectType()
@Entity('products')
export class Product {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field(() => Int)
  vendor_id: number;

  @Field()
  @Column({ length: 50 })
  category: string;

  @Field()
  @Column({ length: 255 })
  description: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  rating: number;

  // TypeORM stores decimal as string by default. Expose as Float in GraphQL.
  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  price: string;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  stock_quantity: number;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;



}
