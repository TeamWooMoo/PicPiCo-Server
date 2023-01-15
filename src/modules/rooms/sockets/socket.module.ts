import { Module } from '@nestjs/common';
import { SignalingGateway } from './signaling.gateway';
import { CameraGateway } from './camera.gateway';
import { DrawingGateway } from './drawing.gateway';
import { RoomsModule } from '../rooms.module';
import { SelectionGateway } from './selection.gateway';

@Module({
    imports: [RoomsModule],
    providers: [
        SignalingGateway,
        CameraGateway,
        DrawingGateway,
        SelectionGateway,
    ],
    exports: [
        SignalingGateway,
        CameraGateway,
        DrawingGateway,
        SelectionGateway,
    ],
})
export class SocketsModule {}
