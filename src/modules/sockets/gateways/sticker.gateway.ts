import {
    SubscribeMessage,
    WebSocketGateway,
    ConnectedSocket,
    MessageBody,
    WebSocketServer,
} from '@nestjs/websockets';
import { MyServer, MySocket } from '../socket.interface';
import { Config } from '../../../config/configuration';
// import { RoomsService } from 'src/modules/rooms/rooms.service';

@WebSocketGateway({
    cors: {
        origin: Config.socket.SOCKET_ORIGIN,
        credentials: Config.socket.SOCKET_SIGNALING_CREDENTIALS,
    },
})
export class StickerGateway {
    // constructor(private readonly roomService: RoomsService) {}

    @WebSocketServer()
    server: MyServer;

    @SubscribeMessage('pick_sticker')
    async handlePickSticker(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        let [url, targetImgIdx] = data;
        console.log('pick_sticker : ', data);

        client.emit('pick_sticker', url, targetImgIdx);
        client.to(client.myRoomId).emit('pick_sticker', url, targetImgIdx);
    }

    @SubscribeMessage('sticker_on')
    async handleStickerOn(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        const [roomId, stickerId] = data;

        client.emit('sticker_on');
        client.to(roomId).emit('sticker_on');
    }

    @SubscribeMessage('sticker_move')
    async handleStickerMove(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        const [left, top, imgIdx, src] = data;

        client.to(client.myRoomId).emit('sticker_move', left, top, imgIdx, src);
    }
}
