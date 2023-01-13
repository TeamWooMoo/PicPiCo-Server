import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SocketModule } from './socket/socket.module';
// import { UploadModule } from './uploads/uploads.module';
import { DrawingGateway } from './socket/drawing/drawing.gateway';
import { UsersModule } from './users/users.module';

@Module({
    imports: [SocketModule, UsersModule],
    controllers: [AppController],
    providers: [DrawingGateway],
})
export class AppModule {}
