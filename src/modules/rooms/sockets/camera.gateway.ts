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
    async handleAddMember(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        const [roomId, newNickName] = data;
        client.nickName = newNickName;

        await this.roomService.joinRoom(roomId, newNickName);
        const nickNameArr = await this.roomService.getAllMembers(roomId);

        client.to(client.myRoomId).emit('reset_member', nickNameArr);
    }

    @SubscribeMessage('take_pic')
    async handleTakePic(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        let [index, picture] = data;
        await this.roomService.takePicture(client.myRoomId, index, picture);
    }

    @SubscribeMessage('done_take')
    async handleDoneTake(
        @ConnectedSocket() client: MySocket,
        // @MessageBody() data: any,
    ) {
        // 사진 촬영 종료를 알림
        // 서버는 모든 클라이언트들에게
        // 지금까지 take_pic으로 전달받은 사진들을 하나의 자료구조에 담아 전달
        // client.to(client.myRoomId).emit('done_take', imgList);
        const pictures = await this.roomService.getAllPictures(client.myRoomId);
        console.log(
            '<<<<<<<<<<<<<<<<<<<<<<<<<<<< pictures >>>>>>>>>>>>>>>>>>>>>>>>>>>>',
        );
        console.log(pictures);
    }
}
