import {
    Controller,
    Post,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';

const BUCKET_NAME = 'picpicoimage';

@Controller('/uploads')
export class UploadController {
    @Post()
    @UseInterceptors(FileInterceptor('myImageName'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(file);
        AWS.config.update({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY,
            },
        });
        try {
            const upload = await new AWS.S3()
                .putObject({
                    Key: `${Date.now() + file.originalname}`,
                    Body: file.buffer,
                    Bucket: BUCKET_NAME,
                })
                .promise();
            console.log(upload);
        } catch (error) {
            console.log(error);
        }
    }
}
