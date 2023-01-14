import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { SocketsModule } from './sockets/socket.module';
import { RedisModule } from 'src/cache/redis.module';

@Module({
    imports: [SocketsModule, RedisModule],
    controllers: [RoomsController],
    providers: [RoomsService],
    exports: [SocketsModule, RoomsService],
})
export class RoomsModule {}
