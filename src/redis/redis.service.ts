import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    constructor(@Inject('REDIS_CLIENT') private redisClient:Redis){}
         setval(key:string,val:string,exp?:number){
            if(exp){
                return this.redisClient.set(key,val,'EX',exp);
            }
            return this.redisClient.set(key,val)
        }
        getVal(val:string){
            return this.redisClient.get(val);
        }
    
}
