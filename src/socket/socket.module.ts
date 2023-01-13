import { Module } from '@nestjs/common';
import { SignalingGateway } from './signaling/signaling.gateway';
import { CameraGateway } from './camera/camera.gateway';

@Module({
    providers: [SignalingGateway, CameraGateway],
    exports: [SignalingGateway, CameraGateway],
})
export class SocketModule {}
