import {
    SubscribeMessage,
    WebSocketGateway,
    ConnectedSocket,
    MessageBody,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Config } from '../../configuration/configuration';

@WebSocketGateway({
    cors: {
        origin: Config.SOCKET_ORIGIN,
        credentials: Config.SOCKET_SIGNALING_CREDENTIALS,
    },
})
export class SignalingGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('connection')
    handleConnection(@ConnectedSocket() client: Socket) {
        console.log('socket connected!: ', client.id);
    }

    @SubscribeMessage('join_room')
    handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any,
    ) {
        console.log(data); // newSocketId  잘 들어오는지 확인하고 이상하면 나린이한테 뭐라고 하기
        let [roomId, newSocketId] = data;
        client.join(roomId);
        console.log(`${roomId}: ${newSocketId} 입장`);
        client.to(roomId).emit('welcome', newSocketId);
    }

    @SubscribeMessage('offer')
    handleOffer(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        let [offer, newSocketId, oldSocketId] = data;
        client.to(newSocketId).emit('offer', offer, oldSocketId);
    }

    @SubscribeMessage('answer')
    handleAnswer(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        let [answer, oldSocketId, newSocketId] = data;
        client.to(oldSocketId).emit('answer', answer, newSocketId);
    }

    @SubscribeMessage('ice')
    handleWelcome(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        let [ice, peerSocketId, currentSocketId] = data;
        client.to(peerSocketId).emit(ice, currentSocketId);
    }
}
