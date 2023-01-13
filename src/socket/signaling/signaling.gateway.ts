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
        origin: Config.socket.SOCKET_ORIGIN,
        credentials: Config.socket.SOCKET_SIGNALING_CREDENTIALS,
    },
})
export class SignalingGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('connection')
    handleConnection(@ConnectedSocket() client: Socket) {
        console.log('소켓 연결: ', client.id);
    }

    @SubscribeMessage('join_room')
    handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any,
    ) {
        let [roomId, newSocketId] = data;
        client.join(roomId);
        console.log(`${roomId} 방으로 ${newSocketId} 입장`);
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

    @SubscribeMessage('disconnection')
    handleDisconnection(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any,
    ) {
        let [reason] = data;
        console.log(`${client.id} 연결 종료: ${reason}`);
    }
}
