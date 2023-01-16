import {
    SubscribeMessage,
    WebSocketGateway,
    ConnectedSocket,
    MessageBody,
    WebSocketServer,
} from '@nestjs/websockets';
import { MyServer, MySocket } from '../socket.interface';
import { Config } from '../../../config/configuration';
import { RoomsService } from '../../rooms/rooms.service';

@WebSocketGateway({
    cors: {
        origin: Config.socket.SOCKET_ORIGIN,
        credentials: Config.socket.SOCKET_SIGNALING_CREDENTIALS,
    },
})
export class SelectionGateway {
    constructor(private readonly roomService: RoomsService) {}

    @WebSocketServer()
    server: MyServer;

    @SubscribeMessage('pick_pic')
    async handlePickPic(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        let [roomId, picIdx] = data;
        await this.roomService.selectPicture(roomId, picIdx);
        client.to(roomId).emit('pick_pic', picIdx);

        console.log(`[ pick_pic ]: picIdx = ${picIdx}`);
    }

    @SubscribeMessage('done_pick')
    async handleDonePic(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        let roomId = data;
        console.log('[ done_pic ]: roomId = ', roomId);

        if (client.id === (await this.roomService.getRoomHostId(roomId))) {
            await this.roomService.getSelectedPictures(roomId);
            client.emit('done_pick');
            client.to(roomId).emit('done_pick');

            console.log(client.id + '는 방장 맞음');
        } else {
            client.emit('permission_denied');

            console.log(client.id + '는 방장 아님....');
        }
    }
}
