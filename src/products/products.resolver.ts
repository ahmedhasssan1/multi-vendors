import {
  Args,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/CreateProduct.dto';
import { Product } from './entity/products.entity';
import { UseGuards } from '@nestjs/common';
import { VendorGuard } from './guard/vendor.guard';
import { PaginationDto } from './dto/pagination.dto';
// import { genrevendorLoader } from 'src/dataloader/loaders/vensorsProducts';
// import { Vendor } from 'src/vendors/entity/vendors.entity';
// import { IGraphQLContext } from '../types/grapqhql.types';
@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => Product)
  @UseGuards(VendorGuard)
  async createProduct(@Args('ProductInput') product: ProductDto) {
    return await this.productsService.createProduct(product);
  }
  @Query(() => [Product])
  async getAllProducts(@Args('paginationInput') pagination: PaginationDto) {
    return await this.productsService.getAllProducts(pagination);
  }
  @Query(()=>[Product])
  async getMostPurchasesProduct(){
    return await this.productsService.mostPopularProducts();
  }
  
}
