import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UserLoginDto } from './dto/user.login';
import * as bcrypt from 'bcrypt';
import { payloadDto } from './dto/payload.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(payload: payloadDto): Promise<string> {
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  async login(loginInput: UserLoginDto, res: Response): Promise<String> {
    const userExist = await this.userService.findUserByEmail(loginInput.email);
    if (!userExist) {
      throw new UnauthorizedException('User not found');
    }

    const checkPassword = await bcrypt.compare(
      loginInput.password,
      userExist.password,
    );
    if (!checkPassword) {
      throw new UnauthorizedException('password inncorect');
    }
    const payload: payloadDto = {
      sub: userExist.id,
      email: userExist.email,
      role: userExist.role,
    };
    const access_token = await this.generateToken(payload);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });
    return access_token;
  }
  async createRefreshtoken(data: RefreshTokenDto,res:Response): Promise<string> {
    const payload = {
      sub: data.user_id,
      role: data.role,
    };
    const Create_refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH-SECRET'),
      expiresIn: '7d',
    });
    res.cookie('refresh_token', Create_refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });
    return Create_refresh_token;
  }
}
