import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SignalingModule } from './signaling/signaling.module';
import { ConfigurationModule } from './configuration/configuration.module';

@Module({
    imports: [SignalingModule, ConfigurationModule],
    controllers: [AppController],
})
export class AppModule {}
