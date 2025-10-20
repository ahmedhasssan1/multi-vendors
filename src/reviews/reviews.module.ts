import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsResolver } from './reviews.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entity/reviews.entity';
import { VendorsModule } from 'src/vendors/vendors.module';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  imports:[TypeOrmModule.forFeature([Review]),VendorsModule,ClientsModule],
  providers: [ReviewsResolver, ReviewsService],
  exports:[ReviewsService]
})
export class ReviewsModule {}
