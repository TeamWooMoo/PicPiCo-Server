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

        console.log(`[ pick_pic ] on`);

        if ((await this.roomService.getRoomHostId(roomId)) === client.id) {
            await this.roomService.selectPicture(roomId, picIdx);
            client.emit('pick_pic', picIdx);
            client.to(roomId).emit('pick_pic', picIdx);

            console.log(`[ pick_pic ] picIdx = ${picIdx}`);
            console.log(`[ pick_pic ] emit pick_pic`);
        } else {
            client.emit('permission_denied');

            console.log(`[ pick_pic ] emit permission_denied`);
        }
    }

    @SubscribeMessage('done_pick')
    async handleDonePic(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        console.log('[ done_pic ] on');

        const [roomId, socketId] = data;

        if (client.id === (await this.roomService.getRoomHostId(roomId))) {
            console.log('[ done_pic ] ' + client.id + ' === 방장');

            await this.roomService.initPictureViewers(roomId);
            const selectedPictures = await this.roomService.getSelectedPictures(
                roomId,
            );

            const pickNum = selectedPictures.size;
            client.emit('done_pick', selectedPictures);
            client.to(roomId).emit('done_pick', selectedPictures);

            // if (pickNum === 4) {
            //     console.log('다 좋아요');
            //     client.emit('done_pick', selectedPictures);
            //     client.to(roomId).emit('done_pick', selectedPictures);
            // } else {
            //     console.log('4장이 아니에요');
            //     const difference = pickNum - 4;
            //     // 선택한 사진이 4장이 아닐때 발생하는 이벤트 필요함
            //     client.emit('wrong_pick', difference);
            //     client.to(roomId).emit('wrong_pick', difference);
            // }
        } else {
            client.emit('permission_denied');

            console.log('[ done_pic ] ' + client.id + ' !== 방장');
        }
    }
}
