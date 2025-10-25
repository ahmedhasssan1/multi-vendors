import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { TransactionType } from 'src/common/enum/transaction.enum';
import { Order } from 'src/orders/entity/order.entity';
import { Transaction } from 'src/transactions/entity/transaction.entity';
import { Vendor } from 'src/vendors/entity/vendors.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Wallet {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Field(() => Vendor)
  @ManyToOne(() => Vendor, (vendor) => vendor.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendor' })
  vendor: Vendor;

  @Field(() => String)
  @Column({ type: 'varchar', length: 255 ,nullable:true})
  stripeAccountId: string;

  @ManyToOne(() => Order, (order) => order.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'order' })
  @Field(() => Order)
  order: Order;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  @Field(() => Float)
  balance: number;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet, {
    onDelete: 'SET NULL',
  })
  @Field(() => [Transaction], { nullable: true })
  transactions: Transaction[];

  @Column({ type: 'varchar' ,nullable:true})
  @Field(() => String)
  currency: string;

  @Column({ type: 'float' ,nullable:true})
  @Field(() => Float)
  pendingBalance: number;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  lastUpdated: Date;
}
