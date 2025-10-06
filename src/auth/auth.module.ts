import { Inject, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports:[ConfigModule],
      useFactory: async (configService:ConfigService)=>({
        secret:configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: '1d' },
        global: true,
      }),
      inject:[ConfigService]
    }),
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
