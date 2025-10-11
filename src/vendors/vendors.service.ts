import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendor } from './entity/vendors.entity';
import { Repository } from 'typeorm';
import { ClientDto } from 'src/users/dto/client.dto';
import { throws } from 'assert';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor) private vendorRepo: Repository<Vendor>,
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
    vendor_exist.status = 'verified';
    return await this.vendorRepo.save(vendor_exist);
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
    if(!vendor){
      throw new NotFoundException("this vendor with this user id not exist")
    }
    return vendor;
  }

}
