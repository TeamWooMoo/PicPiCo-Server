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
        const [roomId, picIdx] = data;

        if ((await this.roomService.getRoomHostId(roomId)) === client.id) {
            await this.roomService.selectPicture(roomId, picIdx);
            client.to(roomId).emit('pick_pic', picIdx);
        } else {
            client.emit('permission_denied');
        }
        console.log(`[ pick_pic ]: picIdx = ${picIdx}`);
    }

    @SubscribeMessage('done_pick')
    async handleDonePic(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        const [roomId, socketId] = data;
        console.log('[ done_pic ]: roomId = ', roomId);

        if (client.id === (await this.roomService.getRoomHostId(roomId))) {
            console.log(client.id + '는 방장 맞음');

            const selectedPictures = await this.roomService.getSelectedPictures(
                roomId,
            );

            const pickNum = selectedPictures.size;
            // client.emit('done_pick', selectedPictures);
            // client.to(roomId).emit('done_pick', selectedPictures);
            if (pickNum === 4) {
                console.log('다 좋아요');
                client.emit('done_pick', selectedPictures);
                client.to(roomId).emit('done_pick', selectedPictures);
            } else {
                console.log('4장이 아니에요');
                const difference = pickNum - 4;
                // 선택한 사진이 4장이 아닐때 발생하는 이벤트 필요함
                client.emit('wrong_pick', difference);
                client.to(roomId).emit('wrong_pick', difference);
            }
        } else {
            client.emit('permission_denied');

            console.log(client.id + '는 방장 아님....');
        }
    }
}
