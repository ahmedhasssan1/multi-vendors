import {  Module } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { VendorsResolver } from './vendors.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './entity/vendors.entity';
import { BullmqModule } from 'src/bullmq/bullmq.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor]), BullmqModule],
  providers: [VendorsResolver, VendorsService],
  exports: [VendorsService],
})
export class VendorsModule {}
