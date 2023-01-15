import {
    SubscribeMessage,
    WebSocketGateway,
    ConnectedSocket,
    MessageBody,
    WebSocketServer,
} from '@nestjs/websockets';
import { MyServer, MySocket } from './socket.dto';
import { Config } from '../../../config/configuration';
import { RoomsService } from '../rooms.service';

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
        let [picIdx] = data;
        await this.roomService.selectPicture(client.myRoomId, picIdx);
        client.to(client.myRoomId).emit('pick_pic', picIdx);
    }

    @SubscribeMessage('done_pick')
    handleDonePic(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        console.log('done_pic: ', client.myRoomId);
        // 사진 선택 완료
    }
}
