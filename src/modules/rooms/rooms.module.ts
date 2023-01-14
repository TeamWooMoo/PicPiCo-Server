import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { SocketsModule } from './sockets/socket.module';

@Module({
    imports: [SocketsModule],
    controllers: [RoomsController],
    providers: [RoomsService],
    exports: [SocketsModule],
})
export class RoomsModule {}
