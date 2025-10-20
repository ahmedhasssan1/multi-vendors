import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Vendor } from 'src/vendors/entity/vendors.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';

@ObjectType()
@Entity('products')
export  class Product {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  name: string;

  @ManyToOne(() => Vendor, (vendor) => vendor.products, { onDelete: 'CASCADE' })
  @Field(() => Vendor)
  @JoinColumn()
  vendor: Vendor;

  @Field(() => Int)
  @Column({nullable:true})
  vendor_id: number;

  @Field(() => String)
  @Column({ length: 50 })
  category: string;

  @Field()
  @Column({ length: 255 })
  description: string;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'int', default: 0 })
  rating: number;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  price: number;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  stock_quantity: number;

  @Field(()=>Int,{nullable:true})
  @Column({type:"int"})
  number_of_purchases:number

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
