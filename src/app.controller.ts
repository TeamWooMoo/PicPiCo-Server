import { Body, Controller, Get, Param, Post, Render } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    @Render('index')
    root() {}
}
