import { forwardRef, Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';
import { DataloaderResolver } from './dataloader.resolver';
// import { ProductsService } from 'src/products/products.service';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [ ProductsModule],
  providers: [DataloaderResolver, DataloaderService],
  exports:[DataloaderService]
})
export class DataloaderModule {}
