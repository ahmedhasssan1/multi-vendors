import {
  Args,
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { VendorsService } from './vendors.service';
import { Vendor } from './entity/vendors.entity';
import { Product } from 'src/products/entity/products.entity';
import {
  IDataloaders,
  ReviewLoaders,
} from 'src/dataloader/loaders/dataloader.interface';
import { ProductsService } from 'src/products/products.service';
import { query } from 'express';
import { Review } from 'src/reviews/entity/reviews.entity';

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

  @ResolveField('reviews', () => [Review])
  getReviews(
    @Parent() vendor: Vendor,
    @Context() { reviewLoader }: { reviewLoader: ReviewLoaders },
  ) {
    return reviewLoader.reviewLoader.load(vendor.id);
  }

  @Query(() => [Vendor])
  async mostPopularVendors(
    @Args('timeframe', { type: () => String, nullable: true })
    timeframe?: string,
  ) {
    return await this.vendorsService.getMostPopularVendors(
      timeframe as 'day' | 'week' | 'month' | 'year' | undefined,
    );
  }
}
