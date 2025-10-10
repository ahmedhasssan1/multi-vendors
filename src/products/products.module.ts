import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/products.entity';
import { VendorsModule } from 'src/vendors/vendors.module';
import { VendorGuard } from './guard/vendor.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    VendorsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],  
  providers: [ProductsResolver, ProductsService],
  exports:[ProductsService]
})
export class ProductsModule {}
