import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisResolver } from './redis.resolver';
import { ConfigService } from '@nestjs/config';
import * as Redis from 'ioredis';
import * as dotenv from "dotenv"
dotenv.config()

@Module({
  
  providers: [RedisResolver, RedisService,
   {
    provide:'REDIS_CLIENT',
    useFactory:()=>{
      return new Redis.Redis({
        host:process.env.REDIS_HOST,
        port:6379
      })
    }
  }
  ],
  exports:['REDIS_CLIENT',RedisService]
})
export class RedisModule {}
