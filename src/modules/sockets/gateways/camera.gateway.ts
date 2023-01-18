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

            await this.roomService.joinRoom(roomId, newNickName, client.id);
            const nickNameArr = await this.roomService.getAllMembers(roomId);

            client.emit('reset_member', nickNameArr);
            client.to(client.myRoomId).emit('reset_member', nickNameArr);

            console.log(`[ add_member ]: nickNameArr = ${nickNameArr}`);
        } else {
            client.disconnect(true);
        }
    }

    // 셔터 누른 사람
    @SubscribeMessage('click_shutter')
    async handleTakePic(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        const setIdx = data;

        await this.roomService.initPrevPicture(client.myRoomId, setIdx);

        client.emit('click_shutter', setIdx);
        client.to(client.myRoomId).emit('click_shutter', setIdx);

        console.log('[ click_shutter ]: client.myRoomId = ', client.myRoomId);
    }

    // 셔터 누른 사람 포함 전부
    @SubscribeMessage('send_pic')
    async handleBeingTaken(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        const [setIdx, picture] = data;

        await this.roomService.takePrevPicture(
            client.myRoomId,
            setIdx,
            picture,
            client.id,
        );

        if (
            (await this.roomService.getAllMembers(client.myRoomId)).length ===
            (await this.roomService.getPrevPicSize(client.myRoomId, setIdx))
        ) {
            const hostId = await this.roomService.getRoomHostId(
                client.myRoomId,
            );

            const prevPictures = await this.roomService.getPrevPicture(
                client.myRoomId,
                setIdx,
            );
            client.to(hostId).emit('send_pic', setIdx, prevPictures);
        }

        // await this.roomService.takePicture(client.myRoomId, setIdx, picture);

        // client.emit('take_pic', setIdx);
        // client.to(client.myRoomId).emit('take_pic', setIdx);

        // 만약 모든 클라이언트가 사진 다 보내면
        // 셔터 누른애 한테

        console.log('[ take_pic ]: client.myRoomId = ', client.myRoomId);
    }

    @SubscribeMessage('result_pic')
    async handleResultPic(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        const [setIdx, picture] = data;

        await this.roomService.takePicture(client.myRoomId, setIdx, picture);

        // client.emit('take_pic', setIdx);
        // client.to(client.myRoomId).emit('take_pic', setIdx);

        // 만약 모든 클라이언트가 사진 다 보내면
        // 셔터 누른애 한테
        // client.to('셔터 누른애').emit('send_pic', '사진 n장');
    }

    @SubscribeMessage('done_take')
    async handleDoneTake(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        const [roomId, socketId] = data;
        console.log(roomId);

        const pictures = await this.roomService.getAllPictures(roomId);
        client.emit('done_take', pictures);
        client.to(roomId).emit('done_take', pictures);

        // 호스트만 사진 촬영 다음단계로 넘어갈 수 있음
        // if (client.id === (await this.roomService.getRoomHostId(roomId))) {
        //     const pictures = await this.roomService.getAllPictures(roomId);

        //     if (pictures.size === 4) {
        //         // 4장 미만으로 찍었을 경우 4장 이상으로 찍어야 한다는 사실 알려주는 이벤트 있어야함
        //         // 클라이언트에서 어떻게 출력되는지 확인 필요
        //         // pictures가 가지고 있는 이미지 src가 전달 후에도 이미지로 출력될 수 있는지 확인
        //     } else {
        //         // 4장 미만이라 다음 단계로 못 넘어간다는 이벤트
        //     }
        // } else {
        //     // 당신은 호스트가 아니라서 버튼을 누를 수 없다는 이벤트
        // }

        console.log('[ done_take ]: client.myRoomId = ', roomId);
    }
}
