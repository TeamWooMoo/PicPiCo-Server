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
export class DecoGateway {
    constructor(private readonly roomService: RoomsService) {}

    @WebSocketServer()
    server: MyServer;

    @SubscribeMessage('pick_deco')
    async handlePickDeco(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        const [socketId, toImgIdx, fromImgIdx] = data;

        await this.roomService.deletePictureViewer(
            client.myRoomId,
            socketId,
            fromImgIdx,
        );
        await this.roomService.addPictureViewer(
            client.myRoomId,
            socketId,
            client.nickName,
            toImgIdx,
        );
        const pictures = await this.roomService.getSelectedPictures(
            client.myRoomId,
        );

        client.emit('pick_deco', pictures);
        client.to(client.myRoomId).emit('pick_deco', pictures);
    }

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
}
