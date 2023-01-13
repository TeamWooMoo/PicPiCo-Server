import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SocketModule } from './socket/socket.module';
import { UploadModule } from './uploads/uploads.module';

@Module({
    imports: [SocketModule, UploadModule],
    controllers: [AppController],
})
export class AppModule {}
