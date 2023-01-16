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
export class SignalingGateway {
    constructor(private readonly roomService: RoomsService) {}

    @WebSocketServer()
    server: MyServer;

    @SubscribeMessage('connection')
    handleConnection(@ConnectedSocket() client: MySocket) {
        client.myRoomId = Config.socket.DEFAULT_ROOM;
        console.log('[ Connection ] client.id = ', client.id);

        client.on('disconnect', async (reason) => {
            console.log(`${client.id} 연결 종료: ${reason}`);

            if (client.myRoomId !== Config.socket.DEFAULT_ROOM) {
                client.to(client.myRoomId).emit('gone', client.id);
                console.log(`${client.id} gone.`);

                await this.roomService.leaveRoom(
                    client.myRoomId,
                    client.nickName,
                );
                const members = await this.roomService.getAllMembers(
                    client.myRoomId,
                );
                if (members.length === 0) {
                    await this.roomService.destroyRoom(client.myRoomId);
                }
                client.to(client.myRoomId).emit('reset_member', members);
            }
        });
    }

    @SubscribeMessage('join_room')
    async handleJoinRoom(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        console.log('join Room()');

        let [roomId, newSocketId] = data;
        if (await this.roomService.isRoom(roomId)) {
            client.join(roomId);
            client.myRoomId = roomId;

            console.log(`${roomId} 방으로 ${newSocketId} 입장`);
            client.to(roomId).emit('welcome', newSocketId);
        }
    }

    @SubscribeMessage('offer')
    handleOffer(@ConnectedSocket() client: MySocket, @MessageBody() data: any) {
        let [offer, newSocketId, oldSocketId] = data;
        client.to(newSocketId).emit('offer', offer, oldSocketId);
    }

    @SubscribeMessage('answer')
    handleAnswer(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        let [answer, oldSocketId, newSocketId] = data;
        client.to(oldSocketId).emit('answer', answer, newSocketId);
    }

    @SubscribeMessage('ice')
    handleWelcome(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        let [ice, peerSocketId, currentSocketId] = data;
        client.to(peerSocketId).emit(ice, currentSocketId);
    }
}
