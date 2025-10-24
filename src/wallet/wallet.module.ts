import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletResolver } from './wallet.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/transactions/entity/transaction.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { Wallet } from './entity/wallet.entity';
import { VendorsModule } from 'src/vendors/vendors.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction]), OrdersModule,VendorsModule],
  providers: [WalletResolver, WalletService],
  exports:[WalletService]
})
export class WalletModule {}
