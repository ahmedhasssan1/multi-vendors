import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletResolver } from './wallet.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/transactions/entity/transaction.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { Wallet } from './entity/wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction]), OrdersModule],
  providers: [WalletResolver, WalletService],
})
export class WalletModule {}
