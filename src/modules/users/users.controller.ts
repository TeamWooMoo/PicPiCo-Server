import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Req,
    Query,
    Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './users.dto';
import { Response } from 'express';
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async signUp(@Body() newUser: UserDto) {
        let createdUser = await this.usersService.create(newUser);
        if (createdUser) {
            return { newUser };
        }
    }

    @Get('login')
    async login(@Query() qs, @Res() res: Response): Promise<any> {
        const id = qs.id;
        const nickname = qs.nickname;
        console.log(id);
        console.log(nickname);
<<<<<<< HEAD
=======
        res.redirect('https://picpico.site/room');
>>>>>>> master
    }

}
