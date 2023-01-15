import { Controller, Post, Get, Body, Param, Res } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Response } from 'express';
// import {Res} from "express"

@Controller('rooms')
export class RoomsController {
    constructor(private readonly roomService: RoomsService) {}

    @Post()
    createRoom(@Body() roomInfo: any) {
        let roomId = roomInfo['roomId'];
        // Id가 roomId인 room을 메모리에 저장
        console.log('POST: roomId: ', roomId);
        return { roomId: roomId };
    }

    @Get(':roomId')
    getRoom(@Param('roomId') roomId: string, @Res() res: Response) {
        console.log('GET: roomId: ', roomId);
        // Id가 roomId인 room을 메모리에서 꺼냄
        // Id가 roomId인 room이 있는지 없는지?
        if (this.roomService.isRoom(roomId)) {
            return { roomId: roomId };
        } else {
            res.status(404).send('잘못된 방 아이디 입니다.');
        }
    }
}
