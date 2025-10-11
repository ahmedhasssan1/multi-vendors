import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { VendorsService } from 'src/vendors/vendors.service';

@Injectable()
export class VendorGuard implements CanActivate {
  constructor(
    private jwtservice: JwtService,
    private configservice: ConfigService,
    private vendorService: VendorsService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const token = request.cookies?.access_token;

    const decode = await this.jwtservice.verifyAsync(token, {
      secret: this.configservice.get<string>('JWT_SECRET'),
    });
    if (!decode) {
      throw new BadRequestException('no access token ');
    }
    const role = decode.role;
    const vendor = await this.vendorService.findVendorByUserId(decode.sub);
    if (vendor?.status != 'verified') {
      throw new ForbiddenException('this vendor not verified yet');
    }
    if (role != 'vendor') {
      return false;
    }
    return true;
  }
}
