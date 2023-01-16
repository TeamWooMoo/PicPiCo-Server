import { Module } from '@nestjs/common';
import { SignalingGateway } from './gateways/signaling.gateway';
import { CameraGateway } from './gateways/camera.gateway';
import { DrawingGateway } from './gateways/drawing.gateway';
import { RoomsModule } from '../rooms/rooms.module';
import { SelectionGateway } from './gateways/selection.gateway';

@Module({
    imports: [RoomsModule],
    providers: [
        SignalingGateway,
        CameraGateway,
        DrawingGateway,
        SelectionGateway,
    ],
})
export class SocketsModule {}
