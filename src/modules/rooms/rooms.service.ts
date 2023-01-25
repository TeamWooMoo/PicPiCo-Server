import { Injectable } from '@nestjs/common';
import { RoomValueDto, RawPicture, DecoPicture, User } from './rooms.dto';
import { RedisService } from '../../cache/redis.service';
import { Config } from '../../config/configuration';

@Injectable()
export class RoomsService {
    fs = require('fs');
    constructor(private readonly redisService: RedisService) {}

    // 방: 방 만들기
    async createRoom(roomId: string, hostName: string, hostId: string): Promise<void> {
        await this.fs.mkdirSync(Config.images.baseDirectory + roomId);
        await this.redisService.setRoom(roomId, new RoomValueDto(hostName, hostId));
    }

    // 방: 방 삭제하기
    async destroyRoom(roomId: string) {
        console.log('방을 삭제합니다. : ', roomId);

        await this.fs.rm(Config.images.baseDirectory + roomId + '/', { recursive: true }, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`${Config.images.baseDirectory + roomId} 디렉토리 삭제 완료`);
            }
        });
        await this.redisService.deleteRoom(roomId);
    }

    // 방: 방에 입장하기
    async joinRoom(roomId: string, memberNickname: string, memberSocketId: string): Promise<void> {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;
        room.members.push(new User(memberNickname, memberSocketId));
        await this.redisService.setRoom(roomId, room);
    }

    // 방: 방이 존재하는지 확인하기
    async isRoom(roomId: string) {
        return await this.redisService.getRoom(roomId);
    }

    // 방: 방에서 나가기
    async leaveRoom(roomId: string, nickName: string) {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;
        let removed = false;

        for (let i = 0; i < room.members.length; i++) {
            try {
                if (room.members[i]['nickName'] === nickName) {
                    room.members.splice(i, 1);
                    removed = true;
                    break;
                }
            } catch (e) {
                console.log(e);
            }
        }

        console.log(removed ? '삭제 완료' : `삭제 대상인 ${nickName}이 존재하지 않습니다.`);
        await this.redisService.setRoom(roomId, room);
    }

    async changeRoomHost(roomId: string) {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;

        room.host.nickName = room.members[0].nickName;
        room.host.socketId = room.members[0].socketId;
        await this.redisService.setRoom(roomId, room);
    }

    // 방: 방의 호스트 아이디 반환
    async getRoomHostId(roomId: string): Promise<string> {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;
        return room.host.socketId;
    }

    // 촬영 - 개별 사진: 참여자들의 순서 바꾸기, 변경된 멤버 리스트 반환
    async reorderRoomMemberList(roomId: string, oldIdx: number, newIdx: number) {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;

        const target = room.members[oldIdx];
        room.members.splice(oldIdx, 1);
        room.members.splice(newIdx, 0, target);

        await this.redisService.setRoom(roomId, room);
        return room.members;
    }

    // 촬영 - 개별 사진: 방의 멤버들 리스트 꺼내기
    async getAllMembers(roomId: string): Promise<User[]> {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;
        return room.members;
    }

    // 촬영 - 개별 사진: 촬영된 개별 사진을 담을 객체 생성
    async initRawPictures(roomId: string, setId: string) {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;
        room.prevPictures[setId] = new Array<RawPicture>();
        await this.redisService.setRoom(roomId, room);
    }

    // 촬영 - 개별 사진: 촬영된 개별 사진을 저장
    async takeRawPicture(roomId: string, setId: string, fileName: string, socketId: string, orderIdx: string) {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;

        const order = parseInt(orderIdx);

        if (room.prevPictures[setId]) {
            room.prevPictures[setId].push(new RawPicture(setId, fileName, socketId, order));
        } else {
            console.log('takeRawPicture() :: 잘못된 setID:', setId);
        }
        await this.redisService.setRoom(roomId, room);
    }

    // 촬영 - 개별 사진: 촬영된 모든 개별 사진 Object를 반환
    async getAllRawPictures(roomId: string): Promise<Map<string, Array<RawPicture>>> {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;
        return room.prevPictures;
    }

    //? 촬영 - 합성 사진: 개별 사진들의 합성 사진을 저장
    async takePicture(roomId: string, picNo: string, picture: string) {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;

        const pictureValue = new DecoPicture(picture);

        if (room.pictures === null) {
            console.log('[ERROR] takePicture(): room.pictures === undefined');
        } else {
            room.pictures[picNo] = pictureValue;
        }
        await this.redisService.setRoom(roomId, room);
    }

    // 촬영 - 합성 사진: pictureObj에 담긴 합성 사진들의 이미지 데이터를 저장
    async takeAllPictures(roomId: string, pictureObj: Map<string, string>) {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;

        for (const [picNo, picture] of Object.entries(pictureObj)) {
            const pictureValue = new DecoPicture(picture);
            room.pictures[picNo] = pictureValue;
        }

        await this.redisService.setRoom(roomId, room);
    }

    // 사진선택: 사진의 선택 여부 변경하기
    async selectPicture(roomId: string, picNo: string) {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;

        if (room.pictures[picNo]) {
            let selectFlag = room.pictures[picNo].selected;
            room.pictures[picNo].selected = !selectFlag;
            await this.redisService.setRoom(roomId, room);
        } else {
            console.log(`picNo ${picNo}는 없어요..`);
        }
    }

    // 사진선택: 선택된 사진 목록 반환
    async getSelectedPictures(roomId: string): Promise<Map<string, DecoPicture>> {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;

        const pictures = room.pictures;
        let selectedPictures = new Map<string, DecoPicture>();

        for (const [picNo, pic] of Object.entries(pictures)) {
            if (pic.selected) {
                selectedPictures[picNo] = pic;
            }
        }
        return selectedPictures;
    }

    // 꾸미기: 첫번째 사진의 viewers 배열에 모든 멤버를 다 넣기
    async initPictureViewers(roomId: string) {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;

        for (const [picNo, pic] of Object.entries(room.pictures)) {
            if (pic.selected) {
                for (let i = 0; i < room.members.length; i++) {
                    room.pictures[picNo].viewers.push(room.members[i]);
                }
                break;
            }
        }
        await this.redisService.setRoom(roomId, room);
    }

    // 꾸미기: 꾸미는 사진 변경하기
    async changePictureViewer(roomId: string, socketId: string, fromImgIdx: string, toImgIdx: string) {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;

        for (let i = 0; i < room.pictures[fromImgIdx].viewers.length; i++) {
            if (room.pictures[fromImgIdx].viewers[i].socketId === socketId) {
                let user = room.pictures[fromImgIdx].viewers[i];
                room.pictures[fromImgIdx].viewers.splice(i, 1);
                await room.pictures[toImgIdx].viewers.push(user);
                break;
            }
        }

        await this.redisService.setRoom(roomId, room);
    }

    // 꾸미기: 사진의 viewer 삭제하기
    async deletePictureViewer(roomId: string, socketId: string, imgIdx: string): Promise<User> {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;

        let user: User;
        for (let i = 0; i < room.pictures[imgIdx].viewers.length; i++) {
            if (room.pictures[imgIdx].viewers[i].socketId === socketId) {
                user = room.pictures[imgIdx].viewers[i];
                room.pictures[imgIdx].viewers.splice(i, 1);
                break;
            }
        }
        await this.redisService.setRoom(roomId, room);
        return user;
    }
}
