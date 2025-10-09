import { Module } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { SuperAdminResolver } from './super-admin.resolver';
import { JwtModule } from '@nestjs/jwt';
import { SuperAdminGuard } from './guard/superAdmin.gurad';
import * as dotenv from 'dotenv';
import { VendorsModule } from 'src/vendors/vendors.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperAdmin } from './entity/superAdmin.entity';
dotenv.config();
@Module({
  imports: [TypeOrmModule.forFeature([SuperAdmin]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),VendorsModule
  ],
  providers: [SuperAdminResolver, SuperAdminService,],
  exports:[SuperAdminService]
})
export class SuperAdminModule {}
