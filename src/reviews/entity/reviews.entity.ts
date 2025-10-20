// src/reviews/entities/review.entity.ts
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Vendor } from 'src/vendors/entity/vendors.entity';
import { Product } from 'src/products/entity/products.entity';
import { User } from 'src/users/entity/user.entity';
import { Client } from 'src/clients/entity/client.entity';
import { FilesInterceptor } from '@nestjs/platform-express';

@ObjectType()
@Entity('reviews')
export class Review {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  content: string;

  @Field(() =>Float)
  @Column({type:"float"})
  rating: number;

  @ManyToOne(() => Vendor, (vendor) => vendor.reviews, { onDelete: 'CASCADE' })
  @Field(() => Vendor,{nullable:true})
  vendor: Vendor;

  @Field(()=>Int)
  @Column({type:"int"})
  vendor_id:number

  
  @ManyToOne(() => Client, (Client) => Client.id)
  @Field(()=>Client)
  Client: Client;

  @Column({type:"int"})
  @Field(()=>Int)
  client_id:number

}
