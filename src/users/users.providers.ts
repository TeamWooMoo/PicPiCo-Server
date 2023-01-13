import { Connection } from 'mongoose';
import { UsersSchema } from '../schemas/users.schema';
import { Config } from '../configuration/configuration';

export const usersProviders = [
    {
        provide: Config.mongoDb.USER_PROVIDE,
        useFactory: (connection: Connection) =>
            connection.model('User', UsersSchema),
        inject: [Config.mongoDb.DATABASE_CONNECTION],
    },
];
