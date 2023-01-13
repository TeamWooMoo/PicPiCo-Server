import {
    SubscribeMessage,
    WebSocketGateway,
    ConnectedSocket,
    MessageBody,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Config } from '../../configuration/configuration';

@WebSocketGateway({
    cors: {
        origin: Config.SOCKET_ORIGIN,
        credentials: Config.SOCKET_SIGNALING_CREDENTIALS,
    },
})
export class CameraGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('capture')
    handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any,
    ) {
        // let [roomId, newSocketId] = data;
    }
}
