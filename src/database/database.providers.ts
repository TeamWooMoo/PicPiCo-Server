import * as mongoose from 'mongoose';
import { Config } from '../configuration/configuration';

export const databaseProviders = [
    {
        provide: Config.mongoDb.DATABASE_CONNECTION,
        useFactory: (): Promise<typeof mongoose> =>
            mongoose.connect(Config.mongoDb.MONGO_URL),
    },
];
