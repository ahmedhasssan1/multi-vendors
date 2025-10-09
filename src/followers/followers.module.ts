import { Module } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { FollowersResolver } from './followers.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Followers } from './entity/followers.enity';
import { VendorsModule } from 'src/vendors/vendors.module';
import { ClientsModule } from 'src/clients/clients.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Followers],),
    VendorsModule,
    ClientsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    UsersModule
  ],
  providers: [FollowersResolver, FollowersService],
})
export class FollowersModule {}
