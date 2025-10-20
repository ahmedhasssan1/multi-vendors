import DataLoader from 'dataloader';
import { Product } from 'src/products/entity/products.entity';
import { Review } from 'src/reviews/entity/reviews.entity';

export interface IDataloaders {
  ProductLoader: DataLoader<number, Product>;
}

export interface ReviewLoaders {
  reviewLoader: DataLoader<number, Review>;
}
