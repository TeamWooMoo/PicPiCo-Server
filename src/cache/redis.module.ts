import { CacheModule, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import * as redisStore from 'cache-manager-ioredis';

@Module({
    imports: [
        CacheModule.register({
            store: redisStore,
            host: 'localhost',
            port: 6379,
        }),
    ],
    providers: [RedisService],
    exports: [RedisService], // 한번만 생성
})
export class RedisModule {}
