import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { RedisModule } from 'src/cache/redis.module';

@Module({
    imports: [RedisModule],
    controllers: [RoomsController],
    providers: [RoomsService],
    exports: [RoomsService, RedisModule],
})
export class RoomsModule {}
