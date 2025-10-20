import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entity/reviews.entity';
import { In, Repository } from 'typeorm';
import { ReviewDto } from './dto/createReview,dto';
import { VendorsService } from 'src/vendors/vendors.service';
import { ClientsService } from 'src/clients/clients.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private ReviewsRepo: Repository<Review>,
    private VendorService: VendorsService,
    private clientServive: ClientsService,
  ) {}
  async createReview(reviewInput: ReviewDto): Promise<Review> {
    const vendor = await this.VendorService.findVendorById(
      reviewInput.vendor_id,
    );
    if (!vendor) {
      throw new NotFoundException('this vendor not exist');
    }
    const client = await this.clientServive.findClientById(
      reviewInput.client_id,
    );
    if (!client) {
      throw new NotFoundException('this client not exist');
    }
    const review = this.ReviewsRepo.create({
      ...reviewInput,
      Client: client,
      client_id: client.id,
      vendor: vendor,
      vendor_id: vendor.id,
    });
    const new_review = await this.ReviewsRepo.save(review);
    const new_rating = await this.getAvareageRating(vendor.id);
    vendor.rating = new_rating;
    await this.VendorService.saveVendor(vendor);
    return new_review;
  }
  async getAvareageRating(vendorId: number) {
    const result = await this.ReviewsRepo.createQueryBuilder('review')
      .select('AVG(review.rating)', 'avg')
      .where('review.vendor_id = :vendorId', { vendorId })
      .getRawOne();

    return parseFloat(result.avg) || 0;
  }
  async getReviewByVendorsIds(vendorIds: readonly number[]): Promise<Review[]> {
    return await this.ReviewsRepo.find({
      where: {
        vendor_id: In(vendorIds),
      },
    });
  }
  async getVendorsReviewsBatch(
    vendorsIds: readonly number[],
  ): Promise<(Review | any)[]> {
    const reviews = await this.getReviewByVendorsIds(vendorsIds);
    const result = await this._mapResultToIds(vendorsIds, reviews);
    return result;
  }
  private _mapResultToIds(vendorsIds: readonly number[], reviews: Review[]) {
    return vendorsIds.map(
      (id) =>reviews.filter((review: Review) => review.vendor_id === id) || null,
    );

  }
  async getAllReviews():Promise<Review[]>{
    return await this.ReviewsRepo.find()
  }
  
}
