import { forwardRef, Module } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { VendorsResolver } from './vendors.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './entity/vendors.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Vendor])],
  providers: [VendorsResolver, VendorsService],
  exports:[VendorsService]
})
export class VendorsModule {}
