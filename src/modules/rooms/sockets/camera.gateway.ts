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
export class CameraGateway {
    constructor(private readonly roomService: RoomsService) {}

    @WebSocketServer()
    server: MyServer;

    @SubscribeMessage('add_member')
    handleAddMember(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        let [roomIdm, newNickName] = data;
        // nickName 배열에 저장
        await this.roomService.joinRoom(roomId, newSocketId);
        //
        let nickNameArr;
        client.to(client.myRoomId).emit('add_member', nickNameArr);
    }

    @SubscribeMessage('take_pic')
    handleTakePic(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        // let [imgFile] = data;
        // 촬영된 이미지파일을 전달받아서 s3에 저장한다
    }

    @SubscribeMessage('done_take')
    handleDoneTake(
        @ConnectedSocket() client: MySocket,
        // @MessageBody() data: any,
    ) {
        // 사진 촬영 종료를 알림
        // 서버는 모든 클라이언트들에게
        // 지금까지 take_pic으로 전달받은 사진들을 하나의 자료구조에 담아 전달
        // client.to(client.myRoomId).emit('done_take', imgList);
    }
}
