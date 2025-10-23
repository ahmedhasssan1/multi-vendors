import { Resolver } from '@nestjs/graphql';
import { TransactionsService } from './transactions.service';

@Resolver()
export class TransactionsResolver {
  constructor(private readonly transactionsService: TransactionsService) {}
}
