import {
    SubscribeMessage,
    WebSocketGateway,
    ConnectedSocket,
    MessageBody,
    WebSocketServer,
} from '@nestjs/websockets';
import { MyServer, MySocket } from './socket.dto';
import { Config } from '../../../config/configuration';

@WebSocketGateway({
    cors: {
        origin: Config.socket.SOCKET_ORIGIN,
        credentials: Config.socket.SOCKET_SIGNALING_CREDENTIALS,
    },
})
export class SelectionGateway {
    @WebSocketServer()
    server: MyServer;

    @SubscribeMessage('pick_pic')
    handleAddMember(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        let [picNo] = data;
        // 사진 선택 또는 선택 취소
        client.to(client.myRoomId).emit('pick_pic', picNo);
    }

    @SubscribeMessage('done_pic')
    handleTakePic(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        // 사진 선택 완료
        // 선택된 사진들을 꾸미기로 전달
    }
}
