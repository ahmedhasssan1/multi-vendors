import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SuperAdminService } from './super-admin.service';
import { VendorsService } from 'src/vendors/vendors.service';
import { Vendor } from 'src/vendors/entity/vendors.entity';
import { UseGuards } from '@nestjs/common';
import { SuperAdminGuard } from './guard/superAdmin.gurad';
import { SuperAdmin } from './entity/superAdmin.entity';
import { superAdmindto } from './dto/superAdmin.dto';

@Resolver()
export class SuperAdminResolver {
  constructor(
    private readonly superAdminService: SuperAdminService,
    private vendorService: VendorsService,
  ) {}

  @Mutation(()=>SuperAdmin)
  async createSuperAdmin(@Args('superAdminInput')superAdmin:superAdmindto){
    return await this.superAdminService.createSuperAdmin(superAdmin);
  }


  @UseGuards(SuperAdminGuard)
  @Mutation(() => Vendor)
  async validateVendor(@Args('vendorId') vendorId: number) {
    return await this.vendorService.validateVendor(vendorId);
  }
}
