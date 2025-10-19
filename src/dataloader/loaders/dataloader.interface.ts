import DataLoader from "dataloader";
import { Product } from "src/products/entity/products.entity";

export interface IDataloaders {
  ProductLoader: DataLoader<number,Product>;
}