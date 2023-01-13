import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors();
    // app.setBaseViewsDir(join(__dirname, '..', 'views'));
    // app.setViewEngine('hbs');

    const handleListen = () =>
        console.log(
            `Picpico-Server : Listening on http://${require('ip').address()}:3000`,
        );
    await app.listen(3000, handleListen);
}
bootstrap();
