import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Product } from 'src/products/entity/products.entity';
import { VendorsService } from './vendors.service';
import { Vendor } from './entity/vendors.entity';

@Resolver(() => Product)
export class VendorsResolver {
  constructor(private readonly vendorsService: VendorsService) {}

  @ResolveField(() => Vendor)
  async vendor(
    @Parent() product: Product,
    @Context('vendorLoader')
    vendorLoader: ReturnType<
      typeof import('./dataloader/vensorsProducts').createVendorLoader
    >,
  ) {
    return vendorLoader.load(product.vendor_id);
  }
}
