import { CacheModule, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import * as redisStore from 'cache-manager-ioredis';
import { Config } from '../config/configuration';

@Module({
    imports: [
        CacheModule.register({
            store: redisStore,
            host: Config.redis.host,
            port: Config.redis.port,
        }),
    ],
    providers: [RedisService],
    exports: [RedisService], // 한번만 생성
})
export class RedisModule {}
