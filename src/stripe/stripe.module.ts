import { forwardRef, Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeResolver } from './stripe.resolver';
import { CartItemsModule } from 'src/cart_items/cart_items.module';
import { StripeController } from './stripe.controller';
import { OrdersModule } from 'src/orders/orders.module';
import { OrdersService } from 'src/orders/orders.service';
import { WalletModule } from 'src/wallet/wallet.module';
import { VendorsModule } from 'src/vendors/vendors.module';
import { Transaction } from 'src/transactions/entity/transaction.entity';
import { TransactionsModule } from 'src/transactions/transactions.module';
// import { StripeController } from './stripe.controller';
// import { sessionSataus } from './sessionstatus.controller';

@Module({
  imports: [CartItemsModule, forwardRef(() => OrdersModule),TransactionsModule, WalletModule],
  controllers: [StripeController],
  providers: [StripeResolver, StripeService],
  exports: [StripeService],
})
export class StripeModule {}
