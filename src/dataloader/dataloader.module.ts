import { forwardRef, Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';
import { DataloaderResolver } from './dataloader.resolver';
// import { ProductsService } from 'src/products/products.service';
import { ProductsModule } from 'src/products/products.module';
import { ReviewsModule } from 'src/reviews/reviews.module';

@Module({
  imports: [ ProductsModule,ReviewsModule],
  providers: [DataloaderResolver, DataloaderService],
  exports:[DataloaderService]
})
export class DataloaderModule {}
