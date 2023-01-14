import { Controller, Post, Get, Body, Param } from '@nestjs/common';

@Controller('rooms')
export class RoomsController {
    @Post()
    createRoom(@Body() roomInfo: any) {
        let roomId = roomInfo['roomId'];
        // Id가 roomId인 room을 메모리에 저장
        console.log('POST: roomId: ', roomId);
        return { roomId: roomId };
    }

    @Get(':roomId')
    getRoom(@Param('roomId') roomId: string) {
        // Id가 roomId인 room을 메모리에서 꺼냄
        // Id가 roomId인 room이 있는지 없는지?
        console.log('GET: roomId: ', roomId);
        return { roomId: roomId };
    }
}
