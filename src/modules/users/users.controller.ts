import { Controller, Get, Post, Body, Param, Req, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './users.dto';

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

    @Get()
    async login(@Query() query: any) {
        let { userId, name } = query;
        const result = await this.usersService.fineOne(userId);
    }
}
