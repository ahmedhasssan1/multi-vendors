import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { ClientsModule } from 'src/clients/clients.module';
import { VendorsModule } from 'src/vendors/vendors.module';

@Module({
  imports:[TypeOrmModule.forFeature([User]),ClientsModule,VendorsModule],
  providers: [UsersResolver, UsersService],
  exports:[UsersService]
})

export class UsersModule {}
