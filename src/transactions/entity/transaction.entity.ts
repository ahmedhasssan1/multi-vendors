import {
  ObjectType,
  Field,
  Float,
  ID,
  registerEnumType,
} from '@nestjs/graphql';
import { TransactionType } from 'src/common/enum/transaction.enum';
import { Wallet } from 'src/wallet/entity/wallet.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

registerEnumType(TransactionType, {
  name: 'TransactionType',
  description: 'Type of financial transaction',
});

@ObjectType()
@Entity()
export class Transaction {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  @JoinColumn({ name: 'wallet_id' })
  @Field(() => Wallet)
  wallet: Wallet;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number; // Positive for incoming, negative for outgoing

  @Field(() => TransactionType)
  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Field(() => String)
  @Column()
  status: string;

  @Field(() => Number, )
  @Column({ type:"int" })
  orderId?: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  stripePaymentId?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  stripeTransferId?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  stripeRefundId?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'json', nullable: true })
  metadata?: any;

  @Field()
  @Column()
  description: string;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
