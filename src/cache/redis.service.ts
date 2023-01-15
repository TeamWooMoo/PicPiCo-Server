import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RoomValueDto } from '../modules/rooms/rooms.dto';

@Injectable()
export class RedisService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async getRoom(roomId: string): Promise<RoomValueDto> | null {
        const room = await this.cacheManager.get<RoomValueDto>(roomId);
        return room;
    }

    async setRoom(roomId: string, roomValue: RoomValueDto): Promise<void> {
        await this.cacheManager.set(roomId, roomValue);
    }
}
