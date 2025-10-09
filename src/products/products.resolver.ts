import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/CreateProduct.dto';
import { Product } from './entity/products.entity';
import { UseGuards } from '@nestjs/common';
import { VendorGuard } from './guard/vendor.guard';

@Resolver()
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

@UseGuards(VendorGuard)
@Mutation(()=>Product)
async createProduct(@Args("ProductInput")product:ProductDto){
  return await this.productsService.createProduct(product)
}

}
