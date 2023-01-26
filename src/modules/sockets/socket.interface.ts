import { Server, Socket } from 'socket.io';

export class MySocket extends Socket {
    myRoomId: string;
    nickName: string;
    isObserver: boolean;
}

export class MyServer extends Server {}
