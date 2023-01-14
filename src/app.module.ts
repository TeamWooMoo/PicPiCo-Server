import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
// import { UploadModule } from './uploads/uploads.module';
import { DrawingGateway } from './modules/rooms/sockets/drawing.gateway';
import { UsersModule } from './modules/users/users.module';
import { RoomsModule } from './modules/rooms/rooms.module';
// import { CacheModule } from './cache/cache.module';

@Module({
    imports: [UsersModule, AuthModule, RoomsModule],
    controllers: [AppController],
    providers: [DrawingGateway],
})
export class AppModule {}
