import { Injectable } from '@nestjs/common';
import { RoomValueDto, PictureValue } from './rooms.dto';
import { v4 as uuid } from 'uuid';
import { RedisService } from '../../cache/redis.service';

@Injectable()
export class RoomsService {
    constructor(private readonly redisService: RedisService) {}

    // 방이 있는지 확인하기
    async isRoom(roomId: string) {
        return (await this.redisService.getRoom(roomId)) != null;
    }

    // 방에서 나가기
    async leaveRoom(roomId: string, nickName: string) {
        const room = await this.redisService.getRoom(roomId);
        for (let i = 0; i < room.members.length; i++) {
            if (room.members[i] === 'b') {
                room.members.splice(i, 1);
                i--;
            }
        }
        this.redisService.setRoom(roomId, room);
    }

    // 카메라: 새로운 방 만들기
    async createRoom(roomId: string, hostId: string): Promise<void> {
        console.log('createRoom()');
        const newRoomValue: RoomValueDto = {
            host: hostId,
            members: Array<string>(),
            pictures: new Map<string, PictureValue>(),
        };
        newRoomValue.members.push(hostId);
        await this.redisService.setRoom(roomId, newRoomValue);
    }

    // 카메라: 방에 입장하기
    async joinRoom(roomId: string, member: string): Promise<void> {
        if (this.isRoom(roomId)) {
            const room = await this.redisService.getRoom(roomId);
            room.members.push(member);
            this.redisService.setRoom(roomId, room);
        }
    }

    // 카메라: 방의 멤버들 리스트 꺼내기
    async getAllMembers(roomId: string): Promise<string[]> {
        if (this.isRoom(roomId)) {
            const room = await this.redisService.getRoom(roomId);
            return room.members;
        }
    }

    // 카메라: 방에 찍은 사진 보관하기
    async takePicture(roomId: string, picture: string): uuid {
        const pictureValue: PictureValue = {
            picture: '',
            viewers: [],
            selected: false,
        };
        const picNo = uuid();
        pictureValue.picture = picture;
        const room = await this.redisService.getRoom(roomId);
        room.pictures.set(picNo, pictureValue);
        await this.redisService.setRoom(roomId, room);
    }

    // 사진선택: 찍은 사진의 선택 여부 변경하기
    selectPicture(roomId: string, picNo: uuid, selected: boolean) {}

    // 꾸미기: 선택된 사진들만 불러오기
    getSelectedPictures(roomId: string): Map<string, PictureValue> {
        return;
    }

    // 꾸미기: 사진의 viewer 추가하기

    // 꾸미기: 사진의 viewer 삭제하기

    // 꾸미기: 한 사진의 viewer 리스트 꺼내기
}
