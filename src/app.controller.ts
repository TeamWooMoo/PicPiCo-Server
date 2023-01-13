import { Body, Controller, Get, Param, Post, Render } from '@nestjs/common';

@Controller()
export class AppController {
    // @Get()
    // @Render('index')
    // index() {}

    @Post('/rooms')
    createRoom(@Body() roomInfo: any) {
        let roomId = roomInfo['roomId'];
        console.log('POST: roomId: ', roomId);
        return { roomId: roomId };
    }

    @Get('/rooms/:roomId')
    getRoom(@Param('roomId') roomId: string) {
        console.log('GET: roomId: ', roomId);
        return { roomId: roomId };
    }
}
