import { Injectable } from '@nestjs/common';
import { RoomValueDto, RawPicture, DecoPicture, User } from './rooms.dto';
import { RedisService } from '../../cache/redis.service';
import { Config } from '../../config/configuration';

@Injectable()
export class RoomsService {
    fs = require('fs');
    constructor(private readonly redisService: RedisService) {}

    // 방이 있는지 확인하기
    async isRoom(roomId: string) {
        return await this.redisService.getRoom(roomId);
    }

    // 방 삭제하기
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

    // 방에서 나가기
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

    async getRoomHostId(roomId: string): Promise<string> {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;
        return room.host.socketId;
    }

    async reorderRoomMemberList(roomId: string, oldIdx: number, newIdx: number) {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;

        const target = room.members[oldIdx];
        room.members.splice(oldIdx, 1);
        room.members.splice(newIdx, 0, target);

        await this.redisService.setRoom(roomId, room);
        return room.members;
    }

    // 카메라: 새로운 방 만들기
    async createRoom(roomId: string, hostName: string, hostId: string): Promise<void> {
        await this.fs.mkdirSync(Config.images.baseDirectory + roomId);
        await this.redisService.setRoom(roomId, new RoomValueDto(hostName, hostId));
    }

    // 카메라: 방에 입장하기
    async joinRoom(roomId: string, memberNickname: string, memberSocketId: string): Promise<void> {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;
        room.members.push(new User(memberNickname, memberSocketId));
        await this.redisService.setRoom(roomId, room);
    }

    // 카메라: 방의 멤버들 리스트 꺼내기
    async getAllMembers(roomId: string): Promise<User[]> {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;
        return room.members;
    }

    // 사진 찍기 준비
    async initPrevPicture(roomId: string, setId: string) {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;
        room.prevPictures[setId] = new Array<RawPicture>();
        await this.redisService.setRoom(roomId, room);
    }

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

    async getRawPictureSize(roomId: string, setId: string): Promise<number> {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;
        return room.prevPictures[setId].length;
    }

    async removePrevPicture(roomId: string) {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;
        // 삭제 작업 아직 구현 안됨
        await this.redisService.setRoom(roomId, room);
    }

    async getRawPicture(roomId: string, setId: string): Promise<Array<RawPicture>> {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;
        return room.prevPictures[setId];
    }

    // 카메라: 방에 찍은 사진 보관하기
    async takePicture(roomId: string, picNo: string, picture: string) {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;

        const pictureValue = new DecoPicture(picture);

        // 첫번째로 찍은 사진에 모든 멤버를 다 넣어줌
        if (room.pictures === null) {
            console.log('[ERROR] takePicture(): room.pictures === undefined');
        } else {
            room.pictures[picNo] = pictureValue;
        }
        await this.redisService.setRoom(roomId, room);
    }

    async takeAllPictures(roomId: string, pictureObj: Map<string, string>) {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;

        for (const [picNo, picture] of Object.entries(pictureObj)) {
            const pictureValue = new DecoPicture(picture);
            room.pictures[picNo] = pictureValue;
        }

        await this.redisService.setRoom(roomId, room);
    }

    async getAllRawPictures(roomId: string): Promise<Map<string, Array<RawPicture>>> {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;
        return room.prevPictures;
    }

    // 카메라: 찍은 사진 목록 모두 꺼내오기
    async getAllPictures(roomId: string) {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;
        return room.pictures;
    }

    // 사진선택: 찍은 사진의 선택 여부 변경하기
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

    // 꾸미기: 선택된 사진들만 불러오기
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

    // 꾸미기: 첫번째 사진에 viewer다 넣기
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

    async changePictureViewer(roomId: string, socketId: string, fromImgIdx: string, toImgIdx: string) {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;

        let user: User;

        for (let i = 0; i < room.pictures[fromImgIdx].viewers.length; i++) {
            if (room.pictures[fromImgIdx].viewers[i].socketId === socketId) {
                user = room.pictures[fromImgIdx].viewers[i];
                console.log('deletePictureViewer() ', user);
                room.pictures[fromImgIdx].viewers.splice(i, 1);
                break;
            }
        }

        // const user = await this.deletePictureViewer(roomId, socketId, fromImgIdx);
        console.log('changePictureViewer = ', user);

        await room.pictures[toImgIdx].viewers.push(user);
        await this.redisService.setRoom(roomId, room);
    }

    // 꾸미기: 사진의 viewer 추가하기
    async addPictureViewer(roomId: string, socketId: string, nickname: string, imgIdx: string) {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;
        room.pictures[imgIdx].viewers.push(new User(nickname, socketId));

        await this.redisService.setRoom(roomId, room);
    }

    // 꾸미기: 사진의 viewer 삭제하기
    async deletePictureViewer(roomId: string, socketId: string, imgIdx: string) {
        const room = await this.redisService.getRoom(roomId);
        if (!room) return;

        if (!room.pictures[imgIdx]) {
            console.log('deletePictureViewer() ', imgIdx);
            return;
        }

        let returnValue: User;
        for (let i = 0; i < room.pictures[imgIdx].viewers.length; i++) {
            if (room.pictures[imgIdx].viewers[i].socketId === socketId) {
                returnValue = room.pictures[imgIdx].viewers[i];
                console.log('deletePictureViewer() ', returnValue);
                room.pictures[imgIdx].viewers.splice(i, 1);
                break;
            }
        }

        await this.redisService.setRoom(roomId, room);
        return returnValue;
    }
}
