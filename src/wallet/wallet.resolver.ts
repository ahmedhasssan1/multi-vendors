import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { WalletService } from './wallet.service';
import { Transaction } from 'src/transactions/entity/transaction.entity';
import { PayoutDto } from './dto/payout.dto';

@Resolver()
export class WalletResolver {
  constructor(private readonly walletService: WalletService) {}

    @Mutation(()=>Transaction)
    async createPayout(@Args("payoutInput")payoutData:PayoutDto){
      return await this.walletService.processPayout(payoutData)
    }
    
  
}
