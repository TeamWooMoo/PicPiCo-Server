import { Module } from '@nestjs/common';
import { SignalingGateway } from './signaling.gateway';
import { CameraGateway } from './camera.gateway';
import { DrawingGateway } from './drawing.gateway';

@Module({
    providers: [SignalingGateway, CameraGateway, DrawingGateway],
    exports: [SignalingGateway, CameraGateway, DrawingGateway],
})
export class SocketsModule {}
