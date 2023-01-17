import { Controller, Post, Get, Body, Param, Res } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Response } from 'express';
// import {Res} from "express"

@Controller('rooms')
export class RoomsController {
    constructor(private readonly roomService: RoomsService) {}

    @Post()
    async createRoom(@Body() roomInfo: any) {
        let roomId = roomInfo['roomId'];
        let nickname = roomInfo['nickname'];
        let socketId = roomInfo['socketId'];
        // Id가 roomId인 room을 메모리에 저장
        await this.roomService.createRoom(roomId, nickname, socketId);
        console.log('POST: roomId: ', roomId);
        return { roomId: roomId };
    }

    @Get(':roomId')
    async getRoom(@Param('roomId') roomId: string, @Res() res: Response) {
        console.log('GET: roomId: ', roomId);
        if (await this.roomService.isRoom(roomId)) {
            res.send({ roomId: roomId });
        } else {
            res.status(404).send('잘못된 방 아이디 입니다.');
        }
    }
}
