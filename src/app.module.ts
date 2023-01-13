import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SocketModule } from './socket/socket.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [SocketModule, AuthModule],
    controllers: [AppController],
})
export class AppModule {}
