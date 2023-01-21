import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
// import { UploadModule } from './uploads/uploads.module';
import { UsersModule } from './modules/users/users.module';
import { SocketsModule } from './modules/sockets/socket.module';
import { RoomsModule } from './modules/rooms/rooms.module';

@Module({
    imports: [UsersModule, AuthModule, SocketsModule, RoomsModule],
    controllers: [AppController],
})
export class AppModule {}
