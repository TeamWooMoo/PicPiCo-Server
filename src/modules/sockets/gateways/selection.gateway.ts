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
        console.log('picIdx = ', picIdx);
        console.log('roomId: ', roomId);

        await this.roomService.selectPicture(roomId, picIdx);
        client.to(roomId).emit('pick_pic', picIdx);
    }

    @SubscribeMessage('done_pick')
    handleDonePic(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        let roomId = data;
        console.log('data= ', data);
        console.log('done_pic: ', roomId);
        // 사진 선택 완료

        // client.emit('');
        // client.to(roomId).emit('');
    }
}
