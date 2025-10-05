import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Client } from 'src/clients/entity/client.entity';
import { Vendor } from 'src/vendors/entity/vendors.entity';
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, OneToMany, JoinColumn
} from 'typeorm';


@ObjectType()
@Entity('carts')
export class Cart {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, (c) => c.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  @Field(() => Client)
  client: Client;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total_price: string;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

}
