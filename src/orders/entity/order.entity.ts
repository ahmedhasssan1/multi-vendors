import { ObjectType, Field, Float, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from 'src/clients/entity/client.entity';
import { StringDecoder } from 'string_decoder';

@ObjectType()
@Entity('orders')
export class Order {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(()=>String,)
  @Column({ nullable: true ,})
  stripe_payment_intent_id?: string;

  @Field(()=>String,{ nullable: true })
  @Column({ nullable: true })
  stripe_checkout_session_id?: string; 

  @Field(() => Client, { nullable: true })
  @ManyToOne(() => Client, (client) => client.id)
  client?: Client;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total_amount: number;

  @Field()
  @Column({ default: 'PENDING' })
  status:
    | 'PENDING'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'PAID';

  // Stripe shipping info
  @Field({ nullable: true })
  @Column({ nullable: true })
  customer_name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  address_line1?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  country?: string;


  @Field(()=>String)
  @Column({ nullable: true })
  phone?: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;
}
