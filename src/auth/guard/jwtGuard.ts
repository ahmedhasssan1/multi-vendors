import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';

dotenv.config();

// Public route decorator
export const IS_PUBLIC = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC, true);

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly configservice: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req: Request = ctx.getContext().req;
    const res: Response = ctx.getContext().res;

    if (this.isPublic(context)) return true;

    const accessToken = req.cookies?.access_token;
    const refreshToken = req.cookies?.refresh_token;

    if (!accessToken)
      throw new UnauthorizedException('No access token provided');
    if (!refreshToken)
      throw new UnauthorizedException('No refresh token provided');

    const isBlacklisted = await this.isTokenBlacklisted(accessToken);
    if (isBlacklisted)
      throw new UnauthorizedException('Token has been revoked');

    try {
      const payload = await this.verifyAccessToken(accessToken);
      (req as any).user = payload;

      return true;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return await this.handleExpiredToken(req, res, refreshToken);
      }

      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private isPublic(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private async verifyAccessToken(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
  }

  private async isTokenBlacklisted(token: string): Promise<boolean> {
    return Boolean(await this.redisService.getVal(`blacklist:${token}`));
  }

  private async handleExpiredToken(
    req: Request,
    res: Response,
    refreshToken: string,
  ): Promise<boolean> {
    try {
      console.log('1️⃣ Verifying refresh token...');

      const decodedRefresh = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configservice.get<string>('REFRESH_SECRET'),
      });
      console.log('debugging ', '3fasa');

      const user = await this.userService.findUserById(decodedRefresh.sub);
      if (!user) throw new UnauthorizedException('Invalid user');

      const newPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };
      console.log('debugging ', '1');

      const newAccessToken = await this.jwtService.signAsync(newPayload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '2m',
      });
      console.log('debugging ', '2');

      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      });

      (req as any).user = newPayload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Could not refresh token');
    }
  }
}
