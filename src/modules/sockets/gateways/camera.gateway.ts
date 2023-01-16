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

            console.log('add_member(): nickNameArr = ', nickNameArr);

            client.emit('reset_member', nickNameArr);
            client.to(client.myRoomId).emit('reset_member', nickNameArr);
        } else {
            client.disconnect(true);
        }
    }

    @SubscribeMessage('take_pic')
    async handleTakePic(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        let [index, picture] = data;
        console.log('take_pic: client.myRoomId = ', client.myRoomId);
        await this.roomService.takePicture(client.myRoomId, index, picture);
    }

    @SubscribeMessage('done_take')
    async handleDoneTake(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        let roomId = data;
        console.log('done_take: client.myRoomId = ', roomId);

        const pictures = await this.roomService.getAllPictures(roomId);

        client.emit('done_take', pictures);
        client.to(roomId).emit('done_take', pictures);
    }
}
