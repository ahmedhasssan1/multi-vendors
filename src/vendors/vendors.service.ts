import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendor } from './entity/vendors.entity';
import { Repository } from 'typeorm';
import { ClientDto } from 'src/users/dto/client.dto';

@Injectable()
export class VendorsService {
    constructor(@InjectRepository(Vendor) private vendorRepo:Repository<Vendor>){}

    async createVendor(vendorInput:ClientDto):Promise<Vendor>{
        const vendorExist=await this.vendorRepo.findOne({where:{email:vendorInput.email}});
        if(vendorExist){
            throw new UnauthorizedException("this vendor email; already exist");
        }
        const vendor=this.vendorRepo.create(vendorInput);
        return await this.vendorRepo.save(vendor);
    }
}
