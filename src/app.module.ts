import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
// import { UploadModule } from './uploads/uploads.module';
import { UsersModule } from './modules/users/users.module';
import { SocketsModule } from './modules/sockets/socket.module';

@Module({
    imports: [UsersModule, AuthModule, SocketsModule],
    controllers: [AppController],
})
export class AppModule {}
