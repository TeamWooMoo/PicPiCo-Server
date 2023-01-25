import { SubscribeMessage, WebSocketGateway, ConnectedSocket, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { MyServer, MySocket } from '../socket.interface';
import { Config } from '../../../config/configuration';
import { RoomsService } from 'src/modules/rooms/rooms.service';

@WebSocketGateway({
    cors: {
        origin: Config.socket.SOCKET_ORIGIN,
        credentials: Config.socket.SOCKET_SIGNALING_CREDENTIALS,
    },
})
export class DecoGateway {
    constructor(private readonly roomService: RoomsService) {}

    @WebSocketServer()
    server: MyServer;

    @SubscribeMessage('pick_deco')
    async handlePickDeco(@ConnectedSocket() client: MySocket, @MessageBody() data: any) {
        if (!(await this.roomService.isRoom(client.myRoomId))) {
            client.disconnect(true);
        }

        console.log('[ pick_deco ] on');

        const [socketId, toImgIdx, fromImgIdx] = data;

        await this.roomService.changePictureViewer(client.myRoomId, socketId, fromImgIdx, toImgIdx);
        const pictures = await this.roomService.getSelectedPictures(client.myRoomId);

        client.emit('pick_deco', pictures);
        client.to(client.myRoomId).emit('pick_deco', pictures);
    }

    @SubscribeMessage('done_deco')
    async handleDoneDeco(@ConnectedSocket() client: MySocket, @MessageBody() data: any) {
        console.log('[ done_deco ] on');

        const [roomId, clientId] = data;

        if (!(await this.roomService.isRoom(roomId))) {
            client.disconnect(true);
        }

        let hostId = await this.roomService.getRoomHostId(roomId);

        console.log(`[ done_deco ] host ID   == ${hostId}`);
        console.log(`[ done_deco ] client.id == ${client.id}`);
        console.log(`[ done_deco ] roomId    == ${client.myRoomId}`);

        // 호스트인지 여부 확인
        if ((hostId = await this.roomService.getRoomHostId(roomId)) === client.id) {
            // allow
            client.emit('done_deco');
            client.to(client.myRoomId).emit('done_deco');

            console.log('[ done_deco ] emit done_deco');
        } else {
            // deny
            client.emit('permission_denied');

            console.log('[ done_deco ] emit permission_denied');
        }
    }

    @SubscribeMessage('submit_deco')
    async handleSubmitDeco(@ConnectedSocket() client: MySocket) {
        if (!(await this.roomService.isRoom(client.myRoomId))) {
            client.disconnect(true);
        }

        console.log('[ submit_deco ] on');

        client.emit('submit_deco');
    }
}
