import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisResolver } from './redis.resolver';
import { ConfigService } from '@nestjs/config';
import * as Redis from 'ioredis';

@Module({
  
  providers: [RedisResolver, RedisService,
   {
    provide:'REDIS_CLIENT',
    useFactory:()=>{
      return new Redis.Redis({
        host:'192.168.116.128',
        port:6379
      })
    }
  }
  ],
  exports:['REDIS_CLIENT',RedisService]
})
export class RedisModule {}
