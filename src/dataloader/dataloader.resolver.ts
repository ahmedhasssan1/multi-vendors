import { Resolver } from '@nestjs/graphql';
import { DataloaderService } from './dataloader.service';

@Resolver()
export class DataloaderResolver {
  constructor(private readonly dataloaderService: DataloaderService) {}
}
