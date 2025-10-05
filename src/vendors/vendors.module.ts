import { Module } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { VendorsResolver } from './vendors.resolver';

@Module({
  providers: [VendorsResolver, VendorsService],
})
export class VendorsModule {}
