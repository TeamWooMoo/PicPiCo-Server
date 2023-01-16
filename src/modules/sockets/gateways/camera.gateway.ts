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

            if (
                client.nickName ===
                (await this.roomService.getRoomHostName(roomId))
            ) {
                await this.roomService.setRoomHost(roomId, client.id);
            }

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
        let [index, picture] = data;
        await this.roomService.takePicture(client.myRoomId, index, picture);

        console.log('[ take_pic ]: client.myRoomId = ', client.myRoomId);
    }

    @SubscribeMessage('done_take')
    async handleDoneTake(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        let [roomId, socketId] = data;
        console.log(roomId);
        const pictures = await this.roomService.getAllPictures(roomId);

        client.emit('done_take', pictures);
        client.to(roomId).emit('done_take', pictures);
        // 클라이언트에서 어떻게 출력되는지 확인 필요
        // pictures가 가지고 있는 이미지 src가 전달 후에도 이미지로 출력될 수 있는지 확인

        console.log('[ done_take ]: client.myRoomId = ', roomId);
    }
}
