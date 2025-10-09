import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Followers } from './entity/followers.enity';
import { Repository } from 'typeorm';
import { FollowVendorDto } from './dto/followVendor.dt';
import { VendorsService } from 'src/vendors/vendors.service';
import { ClientsService } from 'src/clients/clients.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { userRole } from 'src/common/enum/role.enum';

@Injectable()
export class FollowersService {
  constructor(
    @InjectRepository(Followers) private followersRepo: Repository<Followers>,
    private vendorserice: VendorsService,
    private CleintService: ClientsService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private UserSerivce:UsersService
  ) {}

  async followVendor(
    followInput: FollowVendorDto,
    req: Request,
  ): Promise<Followers> {
    const token = req.cookies?.access_token;

    const decode = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    const client_id = decode.sub;
    const  user_client=await this.UserSerivce.findUserById(client_id);
    if(user_client?.role!=userRole.client){
        throw new NotFoundException("this user is not client")
    }
    const client=await this.CleintService.findUserByEmail(user_client.email);
    const follow_info = await this.followersRepo.findOne({
      where: {
        client: { id: client.id },
        vendor: { id: followInput.vendor_id },
      },
    });
    const vendor = await this.vendorserice.findVendorById(
      followInput.vendor_id,
    );
    if (follow_info) {
      throw new BadRequestException('you already follow this vendor');
    }
    const new_follow = this.followersRepo.create({
      client:client,
      vendor: vendor,
    });
    await this.vendorserice.vendorFollowersIncrease(vendor.id);
    return await this.followersRepo.save(new_follow);
  }
}
