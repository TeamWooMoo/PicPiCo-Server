import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDto } from './users.dto';
import { Config } from '../configuration/configuration';
import { User } from './user.interface';

@Injectable()
export class UsersService {
    constructor(
        @Inject(Config.mongoDb.USER_PROVIDE)
        private userModel: Model<User>,
    ) {}

    async create(userDto: UserDto): Promise<User> {
        const createdUser = new this.userModel(userDto);
        return createdUser.save();
    }

    async fineOne(userId: string): Promise<User> {
        return this.userModel.findOne({ userId: userId }).exec();
    }
}
