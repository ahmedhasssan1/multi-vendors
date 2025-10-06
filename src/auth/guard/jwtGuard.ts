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
import * as dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

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
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req: Request = ctx.getContext().req;
    const res: Response = ctx.getContext().res;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const token = req.cookies?.access_token;
    if (!token) throw new UnauthorizedException('No access token provided');

    const inBlacklist = await this.redisService.getVal(`blacklist:${token}`);
    if (inBlacklist) throw new UnauthorizedException('Token has been revoked');

    try {
      //  Verify access token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      (req as any).user = payload;
      return true;
    } catch (err) {
      // 5️ Handle expired token
      if (err.name === 'TokenExpiredError') {
        try {
          const decoded = this.jwtService.decode(token);
          const user = await this.userService.findUserById(decoded.sub);
          if (!user) throw new UnauthorizedException('Invalid user');

          // 🧠 Generate new access token
          const newPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
          };

          const newAccessToken = await this.jwtService.signAsync(newPayload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '30s',
          });

          res.cookie('access_token', newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24,
          });

          (req as any).user = newPayload;
          return true;
        } catch (e) {
          throw new UnauthorizedException('Could not refresh token');
        }
      }

      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
