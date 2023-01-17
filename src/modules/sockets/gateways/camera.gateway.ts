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

        if (await this.roomService.isRoom(roomId)) {
            client.nickName = newNickName;
            client.myRoomId = roomId;

            await this.roomService.joinRoom(roomId, newNickName);
            const nickNameArr = await this.roomService.getAllMembers(roomId);

            client.emit('reset_member', nickNameArr);
            client.to(client.myRoomId).emit('reset_member', nickNameArr);

            console.log(`[ add_member ]: nickNameArr = ${nickNameArr}`);
        } else {
            client.disconnect(true);
        }
    }

    @SubscribeMessage('take_pic')
    async handleTakePic(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        const [index, picture] = data;
        await this.roomService.takePicture(client.myRoomId, index, picture);

        client.emit('take_pic', index);
        client.to(client.myRoomId).emit('take_pic', index);

        console.log('[ take_pic ]: client.myRoomId = ', client.myRoomId);
    }

    @SubscribeMessage('done_take')
    async handleDoneTake(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        const [roomId, socketId] = data;
        console.log(roomId);
        const pictures = await this.roomService.getAllPictures(roomId);

        // 4장 미만으로 찍었을 경우 4장 이상으로 찍어야 한다는 사실 알려주는 이벤트 있어야함

        // 클라이언트에서 어떻게 출력되는지 확인 필요
        // pictures가 가지고 있는 이미지 src가 전달 후에도 이미지로 출력될 수 있는지 확인
        client.emit('done_take', pictures);
        client.to(roomId).emit('done_take', pictures);

        console.log('[ done_take ]: client.myRoomId = ', roomId);
    }
}
