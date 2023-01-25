import { Controller, Post, Get, Body, Param, Res } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Response } from 'express';
// import {Res} from "express"

@Controller('rooms/api')
export class RoomsController {
    constructor(private readonly roomService: RoomsService) {}

    @Post()
    async createRoom(@Body() roomInfo: any) {
        let roomId = roomInfo['roomId'];
        let nickname = roomInfo['nickname'];
        let socketId = roomInfo['socketId'];

        if (!(await this.roomService.isRoom(roomId))) {
            await this.roomService.createRoom(roomId, nickname, socketId);
            console.log(`방 생성 완료 : ${roomId}`);
            return { roomId: roomId };
        } else {
            // res.status(404).send('잘못된 방 아이디 입니다.');
        }
    }

    @Get(':roomId')
    async getRoom(@Param('roomId') roomId: string, @Res() res: Response) {
        if (await this.roomService.isRoom(roomId)) {
            console.log(`방 입장 성공 : ${roomId}`);
            res.send({ roomId: roomId });
        } else {
            res.status(404).send('잘못된 방 아이디 입니다.');
        }
    }
}
