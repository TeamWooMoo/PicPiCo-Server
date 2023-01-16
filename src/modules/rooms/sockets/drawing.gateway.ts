import {
    SubscribeMessage,
    WebSocketGateway,
    ConnectedSocket,
    MessageBody,
    WebSocketServer,
} from '@nestjs/websockets';
import { MyServer, MySocket } from './socket.dto';
import { Config } from '../../../config/configuration';
// import { RoomsService } from '../rooms.service';

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
        let [roomId, offX, offY, color, fromSocket] = data;
        client.to(roomId).emit('mouse_down', offX, offY, color, fromSocket);
    }

    @SubscribeMessage('stroke_canvas')
    async handleStrokeCanvas(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        let [roomId, offX, offY, color, fromSocket] = data;
        client.to(roomId).emit('stroke_canvas', offX, offY, color, fromSocket);
    }

    @SubscribeMessage('mouse_up')
    async handleMouseUp(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        // let [roomId, offX, offY] = data;
        // client.to(roomId).emit('stroke_canvas', offX, offY, client.id);
    }
}
