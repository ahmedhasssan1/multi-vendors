import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { IDataloaders, ReviewLoaders } from './loaders/dataloader.interface';
import * as DataLoader from 'dataloader';
import { Product } from 'src/products/entity/products.entity';
import { Review } from 'src/reviews/entity/reviews.entity';
import { timeStamp } from 'console';
import { ReviewsService } from 'src/reviews/reviews.service';

@Injectable()
export class DataloaderService {
    constructor(private readonly productService:ProductsService,
      private readonly reviewService:ReviewsService
    ){}
    getLoaders(): IDataloaders {
    const ProductLoader = this._createProductsLoader();
    return {
      ProductLoader    
    };
  }

  private _createProductsLoader() {
    return new DataLoader<number, Product>(
      async (keys: readonly number[]) =>
        await this.productService.getvendorsProductsBatch(keys as number[]),
    );
  }
  getReviewLoaders():ReviewLoaders{
    const reviewLoader= this._createreviewLoader();
    return {
      reviewLoader
    }
  }
  private _createreviewLoader(){
    return new DataLoader<number,Review>(
      async(keys:readonly number[])=>
        await this.reviewService.getVendorsReviewsBatch(keys as number[])
    )
  }
}
