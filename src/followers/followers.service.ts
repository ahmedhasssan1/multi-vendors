import {
  BadRequestException,
  Delete,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    private UserSerivce: UsersService,
  ) {}

  async decode(token) {
    const token2 = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    return token2;
  }
  async followVendor(
    followInput: FollowVendorDto,
    req: Request,
  ): Promise<Followers> {
    const token = req.cookies?.access_token;

    const decode = await this.decode(token);
    const client_id = decode.sub;
    const user_client = await this.UserSerivce.findUserById(client_id);
    if (user_client?.role != userRole.client) {
      throw new NotFoundException('this user is not client');
    }
    const client = await this.CleintService.findUserByEmail(user_client.email);
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
      client: client,
      vendor: vendor,
    });
    await this.vendorserice.vendorFollowersIncrease(vendor.id);
    return await this.followersRepo.save(new_follow);
  }

  async unfollow(vendorId: number, req: Request): Promise<string> {
    const vendor = await this.vendorserice.findVendorById(vendorId);
    if (!vendor) {
      throw new NotFoundException('this vendor not exist ');
    }
    const token = req.cookies.access_token;
    const decode = await this.decode(token);
    const clinet = await this.CleintService.findClientByUserId(decode.sub);

    const Follow_exist = await this.followersRepo.findOne({
      where: {
        vendor: { id: vendorId },
        client: { id: clinet.id },
      },
    });
    if (!Follow_exist) {
      throw new BadRequestException('you are not following him');
    }
    await this.followersRepo.remove(Follow_exist);
    if (vendor.folowers_count > 0) {
      vendor.folowers_count--;
    }
    await this.vendorserice.saveVendor(vendor);
    return 'unfollow done';
  }
}
