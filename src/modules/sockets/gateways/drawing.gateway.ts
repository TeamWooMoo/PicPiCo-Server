import {
    SubscribeMessage,
    WebSocketGateway,
    ConnectedSocket,
    MessageBody,
    WebSocketServer,
} from '@nestjs/websockets';
import { MyServer, MySocket } from '../socket.interface';
import { Config } from '../../../config/configuration';

@WebSocketGateway({
    cors: {
        origin: Config.socket.SOCKET_ORIGIN,
        credentials: Config.socket.SOCKET_SIGNALING_CREDENTIALS,
    },
})
export class DrawingGateway {
    @WebSocketServer()
    server: MyServer;

    @SubscribeMessage('mouse_down')
    async handleMouseDown(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        let [fromSocket, offX, offY] = data;
        client.to(client.myRoomId).emit('mouse_down', fromSocket, offX, offY);
    }

    @SubscribeMessage('stroke_canvas')
    async handleStrokeCanvas(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        let [roomId, offX, offY, color, fromSocket] = data;
        client.to(roomId).emit('stroke_canvas', offX, offY, color, fromSocket);
    }
}
