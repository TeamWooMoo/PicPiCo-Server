import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Req,
    Query,
    Res,
    Redirect,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './users.dto';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
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
    // @Redirect('http://localhost:3001/lobby')
    async login(@Query() qs, @Res() res: Response): Promise<any> {
        
        console.log(qs);
        const id = qs.id;
        const nickname = qs.nickname;
        console.log(id);
        console.log(nickname);

        // console.log('req header=', req.headers);
        // res.redirect(`http://localhost:3001/lobby`);
        // res.json({'nickname': nickname}).redirect(`http://localhost:3001/lobby`);
        // return {'nickname': nickname};
        res.redirect(`https://picpico.site/lobby/${nickname}`);
    }
}
