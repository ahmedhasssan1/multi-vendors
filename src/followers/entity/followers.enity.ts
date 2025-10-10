import { Field, ObjectType } from '@nestjs/graphql';
import { Client } from 'src/clients/entity/client.entity';
import { Vendor } from 'src/vendors/entity/vendors.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Followers {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @ManyToOne(()=>Vendor,(vendor)=>vendor.id,{onDelete:"CASCADE"})
  @JoinColumn()
  @Field()
  vendor: Vendor;

  @ManyToOne(()=>Client,(client)=>client.id,{onDelete:"CASCADE"})
  @JoinColumn()
  @Field()
  client: Client;

  @Field()
  @CreateDateColumn({type:"timestamp"})
  create_at: Date;

  @Field()
  @UpdateDateColumn({type:"timestamp"})
  updated_at: Date;
}
