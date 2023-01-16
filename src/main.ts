import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Config } from './config/configuration';
// import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors({
        origin: Config.cors.ORIGIN,
        credentials: Config.cors.CREDENTIALS,
    });
    // app.useStaticAssets(join(__dirname, '..', 'views'));
    // app.setBaseViewsDir(join(__dirname, '..', 'views'));

    // app.engine('html', require('ejs').renderFile);
    // app.setViewEngine('html');

    const handleListen = () =>
        console.log(
            `Picpico-Server : Listening on http://${require('ip').address()}:3000`,
        );
    await app.listen(Config.serverPort, handleListen);
}
bootstrap();
