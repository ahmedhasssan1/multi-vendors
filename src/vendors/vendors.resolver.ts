import {
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { VendorsService } from './vendors.service';
import { Vendor } from './entity/vendors.entity';
import { Product } from 'src/products/entity/products.entity';
import { IDataloaders } from 'src/dataloader/loaders/dataloader.interface';
import { ProductsService } from 'src/products/products.service';
import { query } from 'express';

@Resolver(Vendor)
export class VendorsResolver {
  constructor(private readonly vendorsService: VendorsService) {}

  @Query(() => [Vendor])
  async vendors() {
    return await this.vendorsService.getAllVendors();
  }

  @ResolveField('products', () => [Product])
  getProductss(
    @Parent() vendor: Vendor,
    @Context() { loaders }: { loaders: IDataloaders },
  ) {

    // Use the ProductLoader DataLoader
    return loaders.ProductLoader.load(vendor.id);
  }
}
