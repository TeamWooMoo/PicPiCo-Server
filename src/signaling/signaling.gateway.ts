import {
    SubscribeMessage,
    WebSocketGateway,
    ConnectedSocket,
    MessageBody,
    WebSocketServer,
} from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';

const config = new ConfigService();
// const ORIGIN = config.get<string>('SOCKET_ORIGIN');
const ORIGIN = 'http://143.248.229.89:3000';
// const CREDENTIALS = config.get<boolean>('SOCKET_SIGNALING_CREDENTIALS');

@WebSocketGateway({
    cors: {
        origin: ORIGIN,
        credentials: true,
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
        let [roomId, newSocketId] = data;
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
