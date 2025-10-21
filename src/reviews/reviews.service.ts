import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entity/reviews.entity';
import { In, Repository } from 'typeorm';
import { ReviewDto } from './dto/createReview,dto';
import { VendorsService } from 'src/vendors/vendors.service';
import { ClientsService } from 'src/clients/clients.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private ReviewsRepo: Repository<Review>,
    private VendorService: VendorsService,
    private clientServive: ClientsService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}
  async createReview(reviewInput: ReviewDto, req: Request): Promise<Review> {
    const token = req?.cookies?.access_token;
    if (!token) {
      throw new UnauthorizedException('no token provided');
    }
    const decode = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    const vendor = await this.VendorService.findVendorById(
      reviewInput.vendor_id,
    );
    if (!vendor) {
      throw new NotFoundException('this vendor not exist');
    }
    const client = await this.clientServive.findClientByUserId(decode.sub);
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
    console.log('get venro review', vendorsIds);
    const reviews = await this.getReviewByVendorsIds(vendorsIds);
    const result = await this._mapResultToIds(vendorsIds, reviews);
    return result;
  }
  private _mapResultToIds(vendorsIds: readonly number[], reviews: Review[]) {
    return vendorsIds.map(
      (id) =>
        reviews.filter((review: Review) => review.vendor_id === id) || null,
    );
  }
  async getAllReviews(): Promise<Review[]> {
    return await this.ReviewsRepo.find();
  }
}
