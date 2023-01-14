import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors();

    const handleListen = () =>
        console.log(
            `Picpico-Server : Listening on http://${require('ip').address()}:3000`,
        );
    await app.listen(3000, handleListen);
}
bootstrap();
