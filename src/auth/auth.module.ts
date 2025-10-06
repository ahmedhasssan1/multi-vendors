import { Inject, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from 'src/redis/redis.module';
import { JwtGuard } from './guard/jwtGuard';
@Module({
  imports: [
    RedisModule,
    UsersModule,
    JwtModule.registerAsync({
      imports:[ConfigModule],
      useFactory: async (configService:ConfigService)=>({
        secret:configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: '3h' },
        global: true,
      }),
      inject:[ConfigService]
    }),
  ],
  providers: [AuthResolver, AuthService],
  exports:[AuthService,JwtModule]
})
export class AuthModule {}
