import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ required: true })
    userId: string;

    @Prop()
    name: string;
    static userId: any;
}

export const UsersSchema = SchemaFactory.createForClass(User);

// import * as mongoose from 'mongoose';

// export const UsersSchema = new mongoose.Schema({
//     name: String,
//     userId: String,
// });
