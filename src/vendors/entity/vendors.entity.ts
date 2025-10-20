import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Product } from 'src/products/entity/products.entity';
import { Review } from 'src/reviews/entity/reviews.entity';
import { User } from 'src/users/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  OneToMany,
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
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Field()
  user: User;

  @Field()
  @Column({ default: 'pending' })
  status: string;

  @Field(() =>Int, { nullable: true },)
  @Column({ type: 'int', nullable: true })
  rating: number;

  @OneToMany(()=>Review,(review)=>review.vendor,{onDelete:"SET NULL"})
  @Field(()=>[Review],{nullable:true})
  reviews:Review[]
  

  @OneToMany(()=>Product,(Product)=>Product.vendor,{onDelete:"SET NULL"})
  @Field(()=>[Product],{nullable:true})
  products: Product[];

  @Field()
  @Column({ default: 0 })
  folowers_count: number;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
