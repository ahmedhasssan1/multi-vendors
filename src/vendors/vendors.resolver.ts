import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { VendorsService } from './vendors.service';
import { Vendor } from './entity/vendors.entity';
import { UseGuards } from '@nestjs/common';
// import {  SuperAdminGuard } from 'src/super-admin/guard/superAdmin.gurad';

@Resolver()
export class VendorsResolver {
  constructor(private readonly vendorsService: VendorsService) {}



}
