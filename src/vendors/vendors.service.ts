import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendor } from './entity/vendors.entity';
import { In, Repository } from 'typeorm';
import { ClientDto } from 'src/users/dto/client.dto';
import { throws } from 'assert';
import { bullmqService } from 'src/bullmq/bullmq.service';
import { Query } from '@nestjs/graphql';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor) private vendorRepo: Repository<Vendor>,
    private bullmqService: bullmqService,
  ) {}

  async vendorVerfied(vendorId: number): Promise<Vendor> {
    const vendor_exist = await this.vendorRepo.findOne({
      where: { id: vendorId },
    });
    if (vendor_exist?.status == 'pending') {
      throw new UnauthorizedException('this vendor not verified yet');
    }
    return vendor_exist!;
  }

  async createVendor(vendorInput: ClientDto): Promise<Vendor> {
    const vendorExist = await this.vendorRepo.findOne({
      where: { email: vendorInput.email },
    });
    if (vendorExist) {
      throw new UnauthorizedException('this vendor email; already exist');
    }
    const vendor = this.vendorRepo.create(vendorInput);
    return await this.vendorRepo.save(vendor);
  }
  async validateVendor(vendorId: number): Promise<Vendor> {
    const vendor_exist = await this.vendorRepo.findOne({
      where: { id: vendorId },
    });
    if (!vendor_exist) {
      throw new NotFoundException('this vendor does not exist');
    }
    if (vendor_exist.status == 'pending') {
      vendor_exist.status = 'verified';
      await this.bullmqService.handleVendor(vendor_exist.email);
      return await this.vendorRepo.save(vendor_exist);
    }
    await this.bullmqService.handleVendor(vendor_exist.email);
    return vendor_exist;
  }
  async findVendorById(id: number): Promise<Vendor> {
    const vendor = await this.vendorRepo.findOne({ where: { id } });
    if (!vendor) {
      throw new NotFoundException('this vendor not rexist');
    }
    return vendor;
  }
  async vendorFollowersIncrease(vendorId: number) {
    const vendor = await this.vendorRepo.findOne({ where: { id: vendorId } });
    if (!vendor) {
      throw new NotFoundException('this vendor not exist');
    }
    vendor.folowers_count++;
    await this.vendorRepo.save(vendor);
  }
  async saveVendor(vendor: Vendor): Promise<string> {
    await this.vendorRepo.save(vendor);
    return 'vendor saved';
  }
  async findVendorByUserId(id: number): Promise<Vendor> {
    const vendor = await this.vendorRepo.findOne({ where: { user: { id } } });
    if (!vendor) {
      throw new NotFoundException('this vendor with this user id not exist');
    }
    return vendor;
  }
  async findByIds(ids: number[]): Promise<Vendor[]> {
    return this.vendorRepo.findBy({ id: In(ids) });
  }
  async getAllVendors() {
    return await this.vendorRepo.find();
  }

  async getMostPopularVendors(
    timeframe?: 'day' | 'week' | 'month' | 'year' | { from: Date; to: Date },
  ) {
    const query = this.vendorRepo
      .createQueryBuilder('vendor')
      .leftJoin('vendor.products', 'product')
      .addSelect('SUM(product.number_of_purchases)', 'totalPurchases')
      .groupBy('vendor.id');

    //  Optional timeframe filters
    if (timeframe) {
      if (typeof timeframe === 'object') {
        query.where('vendor.created_at BETWEEN :from AND :to', {
          from: timeframe.from,
          to: timeframe.to,
        });
      } else {
        const date = new Date();
        switch (timeframe) {
          case 'day':
            date.setDate(date.getDate() - 1);
            break;
          case 'week':
            date.setDate(date.getDate() - 7);
            break;
          case 'month':
            date.setMonth(date.getMonth() - 1);
            break;
          case 'year':
            date.setFullYear(date.getFullYear() - 1);
            break;
        }
        query.where('vendor.created_at >= :since', { since: date });
      }
    }

    query.orderBy(
      '(vendor.rating * 0.3 + vendor.number_of_purchases * 0.7)',
      'DESC',
    );

    const result = await query.getRawAndEntities();

    // Combine entity with computed values
    return result.entities.map((vendor, i) => ({
      ...vendor,
      totalPurchases: Number(result.raw[i].totalPurchases || 0),
      popularityScore: vendor.rating * 0.7 + vendor.number_of_purchases * 0.3,
    }));
  }
}
