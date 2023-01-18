import { Controller, Get, Render, Res, Param } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
    @Get()
    // @Render('index')
    root(@Res() res: Response) {
        res.status(404).redirect('https://picpico.site');
    }

    // @Get('room/:roomId')
    // async inRoom(@Param('roomId') roomId: string, @Res() res: Response) {
    //     res.redirect('https://picpico.site/room');
    // }
}
