import { Module } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { SuperAdminResolver } from './super-admin.resolver';

@Module({
  providers: [SuperAdminResolver, SuperAdminService],
})
export class SuperAdminModule {}
