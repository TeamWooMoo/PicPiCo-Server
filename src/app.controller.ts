import { Controller, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
    @Get()
    @Render('index')
    root(@Res() res: Response) {
        // res.status(404).redirect('https://picpico.site');
    }
}
