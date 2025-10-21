import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';
import { Review } from './entity/reviews.entity';
import { ReviewDto } from './dto/createReview,dto';
import {Request} from "express"

@Resolver()
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Mutation(() => Review)
  async createReview(@Args('reviewInput') reviewData: ReviewDto,@Context() ctx:{req:Request}) {
    return await this.reviewsService.createReview(reviewData,ctx.req);
  }
  @Query(()=>[Review])
  async getAllreviews(){
    return await this.reviewsService.getAllReviews()
  }
}
