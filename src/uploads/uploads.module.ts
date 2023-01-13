import { Module } from '@nestjs/common';
import { UploadController } from './uploads.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        MulterModule.register({
            // dest: './upload',
        }),
    ],
    controllers: [UploadController],
})
export class UploadModule {}
