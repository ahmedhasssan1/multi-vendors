import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity('vendors')
export class Vendor {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 50 })
  name: string;

  @Field()
  @Column({  unique: true })
  email: string;

  @Column()
  password: string;

  @Field()
  @Column({ default: 'pending'})
  status: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  rating: number;

  @Field({nullable:true})
  @Column({nullable:true})
  products: number;

  @Field()
  @Column({default:0})
  folowers_count: number;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
