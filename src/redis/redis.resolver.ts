import { Resolver } from '@nestjs/graphql';
import { RedisService } from './redis.service';

@Resolver()
export class RedisResolver {
  constructor(private readonly redisService: RedisService) {}
}
