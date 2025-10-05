import { Resolver } from '@nestjs/graphql';
import { VendorsService } from './vendors.service';

@Resolver()
export class VendorsResolver {
  constructor(private readonly vendorsService: VendorsService) {}
}
