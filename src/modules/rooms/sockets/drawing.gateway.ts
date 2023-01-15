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

    @SubscribeMessage('stroke_canvas')
    async handlePickPic(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        let [roomId, offX, offY] = data;
        console.log(`${offX}, ${offY}`);
        console.log('stroke_canvas: roomId = ', roomId);
        client.to(roomId).emit('stroke_canvas', offX, offY);
    }
}
