import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    // console.log('debugging ',request);
    
    const token = request.cookies.access_token;
    if (!token) {
      throw new BadRequestException('no acctess token in cookiesssss');
    }

    const decoded = await this.jwtService.verifyAsync(token, {
      secret: '123',
    });
    return decoded?.role == 'SuperAdmin';
  }
}
  