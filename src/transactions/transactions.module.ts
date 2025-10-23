import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsResolver } from './transactions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';

@Module({
    // imports: [TypeOrmModule.forFeature([Transaction ])],
  providers: [TransactionsResolver, TransactionsService],
})
export class TransactionsModule {}
