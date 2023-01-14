import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Config } from '../config/configuration';

@Module({
    imports: [
        JwtModule.register({
            secret: Config.JWT.SECRET,
            signOptions: { expiresIn: '300s' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
