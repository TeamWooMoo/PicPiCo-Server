import * as mongoose from 'mongoose';
import { Config } from '../config/configuration';

export const databaseProviders = [
    {
        provide: Config.mongoDb.DATABASE_CONNECTION,
        useFactory: (): Promise<typeof mongoose> => {
            mongoose.set('strictQuery', true);
            return mongoose.connect(Config.mongoDb.MONGO_URL);
        },
    },
];
