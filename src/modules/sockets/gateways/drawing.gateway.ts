import {
    SubscribeMessage,
    WebSocketGateway,
    ConnectedSocket,
    MessageBody,
    WebSocketServer,
} from '@nestjs/websockets';
import { MyServer, MySocket } from '../socket.interface';
import { Config } from '../../../config/configuration';
import { RoomsService } from 'src/modules/rooms/rooms.service';

@WebSocketGateway({
    cors: {
        origin: Config.socket.SOCKET_ORIGIN,
        credentials: Config.socket.SOCKET_SIGNALING_CREDENTIALS,
    },
})
export class DrawingGateway {
    constructor(private readonly roomService: RoomsService) {}

    @WebSocketServer()
    server: MyServer;

    @SubscribeMessage('mouse_down')
    async handleMouseDown(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        const [fromSocket, offX, offY, ImgIdx] = data;
        console.log('[ mouse_down ]data =>>>>', data);
        client
            .to(client.myRoomId)
            .emit('mouse_down', fromSocket, offX, offY, ImgIdx);
    }

    @SubscribeMessage('stroke_canvas')
    async handleStrokeCanvas(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        const [roomId, offX, offY, color, fromSocket, ImgIdx] = data;
        console.log('[ stroke_canvas ]data =>>>>', data);
        client
            .to(roomId)
            .emit('stroke_canvas', offX, offY, color, fromSocket, ImgIdx);
    }

    @SubscribeMessage('sticker_on')
    async handleStickerOn(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        const [roomId, stickerId] = data;

        client.emit('sticker_on');
        client.to(roomId).emit('sticker_on');

        // client.to(roomId).emit('sticker_on', offX, offY, fromSocket);
    }

    @SubscribeMessage('sticker_move')
    async handleStickerMove(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        const [roomId, offX, offY, fromSocket] = data;
        client.to(roomId).emit('sticker_move', offX, offY, fromSocket);
    }

    @SubscribeMessage('done_deco')
    async handleDoneDeco(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        console.log('[ done_deco ] on');

        const [roomId, clientId] = data;

        // 호스트인지 여부 확인
        if (client.id === (await this.roomService.getRoomHostId(roomId))) {
            // allow
            client.emit('done_deco');
            client.to(roomId).emit('done_deco');

            console.log('[ done_deco ] emit done_deco');
        } else {
            // deny
            client.emit('permission_denied');
            console.log('[ done_deco ] emit permission_denied');
        }
    }
}
