import {
    SubscribeMessage,
    WebSocketGateway,
    ConnectedSocket,
    MessageBody,
    WebSocketServer,
    OnGatewayInit,
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

        if (!(await this.roomService.isRoom(roomId))) {
            client.disconnect(true);
        }

        client.nickName = newNickName;
        client.myRoomId = roomId;

        await this.roomService.joinRoom(roomId, newNickName, client.id);
        const nickNameArr = await this.roomService.getAllMembers(roomId);

        client.emit('reset_member', nickNameArr);
        client.to(client.myRoomId).emit('reset_member', nickNameArr);
    }

    // 셔터 누른 사람
    @SubscribeMessage('click_shutter')
    async handleTakePic(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        // if (!(await this.roomService.isRoom(client.myRoomId))) {
        //     client.disconnect(true);
        // }

        const setIdx = data;
        console.log('[ click_shutter] on');
        console.log('[ click_shutter] setIdx', setIdx);

        // await this.roomService.initPrevPicture(client.myRoomId, setIdx);
        this.roomService.initPrevPicture(client.myRoomId, setIdx);

        client.emit('click_shutter', setIdx);
        client.to(client.myRoomId).emit('click_shutter', setIdx);
    }

    // 셔터 누른 사람 포함 전부
    @SubscribeMessage('send_pic')
    async handleBeingTaken(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        // if (!(await this.roomService.isRoom(client.myRoomId))) {
        //     client.disconnect(true);
        // }

        console.log('[ send_pic ] on');
        const [setIdx, picture, orderIdx] = data;

        const roomId = client.myRoomId;

        // await this.roomService.takePrevPicture(roomId, setIdx, picture, client.id,);
        this.roomService.takePrevPicture(
            roomId,
            setIdx,
            picture,
            client.id,
            orderIdx,
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

            prevPictures.sort((a, b) => {
                return a.order - b.order;
            });

            console.log('[ send_pic ] hostId', hostId);

            if (hostId === client.id) {
                client.emit('send_pic', setIdx, prevPictures);
            } else {
                client.to(hostId).emit('send_pic', setIdx, prevPictures);
            }
        }
    }

    @SubscribeMessage('result_pic')
    async handleResultPic(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        if (!(await this.roomService.isRoom(client.myRoomId))) {
            client.disconnect(true);
        }

        console.log('[ result_pic ] on');

        const [setIdx, picture] = data;

        await this.roomService.takePicture(client.myRoomId, setIdx, picture);
    }

    @SubscribeMessage('done_take')
    async handleDoneTake(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        console.log('[ done_take ] on');

        const [roomId, socketId] = data;

        if (!(await this.roomService.isRoom(roomId))) {
            client.disconnect(true);
        }

        // 호스트만 사진 촬영 다음단계로 넘어갈 수 있음
        if (client.id === (await this.roomService.getRoomHostId(roomId))) {
            const pictures = await this.roomService.getAllPictures(roomId);

            client.emit('done_take', pictures);
            client.to(roomId).emit('done_take', pictures);

            // if (pictures.size === 4) {
            //     // 4장 미만으로 찍었을 경우 4장 이상으로 찍어야 한다는 사실 알려주는 이벤트 있어야함
            //     // 클라이언트에서 어떻게 출력되는지 확인 필요
            //     // pictures가 가지고 있는 이미지 src가 전달 후에도 이미지로 출력될 수 있는지 확인
            // } else {
            //     // 4장 미만이라 다음 단계로 못 넘어간다는 이벤트
            // }
        } else {
            client.emit('permission_denied');

            console.log('[ done_take ] permission_denied');
        }
    }
}
