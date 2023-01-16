import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Config } from './config/configuration';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors({
        origin: Config.cors.ORIGIN,
        credentials: Config.cors.CREDENTIALS,
    });

    const handleListen = () =>
        console.log(
            `Picpico-Server : Listening on http://${require('ip').address()}:${
                Config.serverPort
            }`,
        );
    await app.listen(Config.serverPort, handleListen);
}
bootstrap();
