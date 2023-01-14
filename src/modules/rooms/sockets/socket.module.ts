import { Module } from '@nestjs/common';
import { SignalingGateway } from './signaling.gateway';
import { PictureGateway } from './picture.gateway';
import { DrawingGateway } from './drawing.gateway';

@Module({
    providers: [SignalingGateway, PictureGateway, DrawingGateway],
    exports: [SignalingGateway, PictureGateway, DrawingGateway],
})
export class SocketsModule {}
