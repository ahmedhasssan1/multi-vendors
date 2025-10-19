import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { IDataloaders } from './loaders/dataloader.interface';
import * as DataLoader from 'dataloader';
import { Product } from 'src/products/entity/products.entity';

@Injectable()
export class DataloaderService {
    constructor(private readonly productService:ProductsService){}
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
}
