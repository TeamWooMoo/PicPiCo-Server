import { Server, Socket } from 'socket.io';

export interface MySocket extends Socket {
    myRoomId: string;
    nickName: string;
}

export interface MyServer extends Server {}
