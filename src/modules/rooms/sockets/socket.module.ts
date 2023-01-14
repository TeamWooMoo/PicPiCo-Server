import { Module } from '@nestjs/common';
import { SignalingGateway } from './signaling.gateway';
import { CameraGateway } from './camera.gateway';
import { DrawingGateway } from './drawing.gateway';
import { RoomsModule } from '../rooms.module';

@Module({
    imports: [RoomsModule],
    providers: [SignalingGateway, CameraGateway, DrawingGateway],
    exports: [SignalingGateway, CameraGateway, DrawingGateway],
})
export class SocketsModule {}
