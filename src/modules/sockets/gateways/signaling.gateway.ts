import {
    SubscribeMessage,
    WebSocketGateway,
    ConnectedSocket,
    MessageBody,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
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
export class SignalingGateway
    implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
    constructor(private readonly roomService: RoomsService) {}

    @WebSocketServer()
    server: MyServer;

    afterInit(server: MyServer) {
        server.setMaxListeners(0);
    }

    async handleConnection(@ConnectedSocket() client: MySocket) {
        client.myRoomId = Config.socket.DEFAULT_ROOM;
        console.log('[ 연결 성공 ] client.id = ', client.id);
    }

    async handleDisconnect(@ConnectedSocket() client: MySocket) {
        console.log('[ 연결 종료 ] client.id = ', client.id);
        if (client.myRoomId !== Config.socket.DEFAULT_ROOM) {
            client.to(client.myRoomId).emit('gone', client.id);

            console.log(`[ 연결 종료 ] ${client.myRoomId} 에서`);
            console.log(`[ 연결 종료 ] ${client.id} 이 나감.`);

            await this.roomService.leaveRoom(client.myRoomId, client.nickName);
            const members = await this.roomService.getAllMembers(
                client.myRoomId,
            );
            if (members.length === 0) {
                await this.roomService.destroyRoom(client.myRoomId);
            }
            client.to(client.myRoomId).emit('reset_member', members);
        }
    }

    @SubscribeMessage('join_room')
    async handleJoinRoom(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        console.log('[ join_room ] on');

        const [roomId, newSocketId] = data;
        if (await this.roomService.isRoom(roomId)) {
            client.join(roomId);
            client.myRoomId = roomId;

            console.log(`[ join_room ] 방 ${roomId} 으로`);
            console.log(`[ join_room ] ${newSocketId} 입장`);

            client.to(roomId).emit('welcome', newSocketId);

            console.log(`[ join_room ] emit welcome`);
        }
    }

    @SubscribeMessage('offer')
    handleOffer(@ConnectedSocket() client: MySocket, @MessageBody() data: any) {
        console.log(`[ offer ] on`);

        const [offer, newSocketId, oldSocketId] = data;
        client.to(newSocketId).emit('offer', offer, oldSocketId);

        console.log(`[ offer ] emit offer`);
    }

    @SubscribeMessage('answer')
    handleAnswer(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        console.log(`[ answer ] on`);

        const [answer, oldSocketId, newSocketId] = data;
        client.to(oldSocketId).emit('answer', answer, newSocketId);

        console.log(`[ answer ] emit answer`);
    }

    @SubscribeMessage('ice')
    handleWelcome(
        @ConnectedSocket() client: MySocket,
        @MessageBody() data: any,
    ) {
        console.log(`[ ice ] on`);

        const [ice, peerSocketId, currentSocketId] = data;
        client.to(peerSocketId).emit('ice', ice, currentSocketId);

        console.log(`[ ice ] emit ice`);
    }
}
