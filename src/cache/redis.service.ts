import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RoomValueDto } from '../modules/rooms/rooms.dto';
import { Config } from '../config/configuration';

@Injectable()
export class RedisService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
        this.reset();
        const fs = require('fs');
        fs.rmdirSync(Config.images.baseDirectory, { recursive: true }, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log(Config.images.baseDirectory + ' 삭제...');
            }
        });
        fs.mkdirSync(Config.images.baseDirectory, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log(Config.images.baseDirectory + ' 생성...');
            }
        });
    }

    async getRoom(roomId: string): Promise<RoomValueDto> | null {
        const room = await this.cacheManager.get<RoomValueDto>(roomId);
        return room;
    }

    async setRoom(roomId: string, roomValue: RoomValueDto): Promise<void> {
        await this.cacheManager.set(roomId, roomValue);
    }

    async reset() {
        await this.cacheManager.reset();
    }

    async deleteRoom(roomId: string) {
        await this.cacheManager.del(roomId);
    }
}
