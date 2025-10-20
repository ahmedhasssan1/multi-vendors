import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';
import { Review } from './entity/reviews.entity';
import { ReviewDto } from './dto/createReview,dto';

@Resolver()
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Mutation(() => Review)
  async createReview(@Args('reviewInput') reviewData: ReviewDto) {
    return await this.reviewsService.createReview(reviewData);
  }
  @Query(()=>[Review])
  async getAllreviews(){
    return await this.reviewsService.getAllReviews()
  }
}
