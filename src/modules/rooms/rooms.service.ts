import { Injectable } from '@nestjs/common';
import { RoomValueDto, PictureValue, User, PrevPicture } from './rooms.dto';
import { RedisService } from '../../cache/redis.service';

@Injectable()
export class RoomsService {
    constructor(private readonly redisService: RedisService) {}

    // 방이 있는지 확인하기
    async isRoom(roomId: string) {
        return (await this.redisService.getRoom(roomId)) !== null;
    }

    // 방 삭제하기
    async destroyRoom(roomId: string) {
        console.log(
            '방에 남은 사람=' +
                (await this.getAllMembers(roomId)).length +
                ': 방을 삭제합니다.',
        );
        await this.redisService.deleteRoom(roomId);
    }

    // 방에서 나가기
    async leaveRoom(roomId: string, nickName: string) {
        if (!(await this.isRoom(roomId))) return;

        const room = await this.redisService.getRoom(roomId);
        let removed = false;

        for (let i = 0; i < room.members.length; i++) {
            if (room.members[i]['nickName'] === nickName) {
                room.members.splice(i, 1);
                removed = true;
                break;
            }
        }

        console.log(
            removed
                ? '삭제 완료'
                : `삭제 대상인 ${nickName}이 존재하지 않습니다.`,
        );
        await this.redisService.setRoom(roomId, room);
    }

    async getRoomHostName(roomId: string): Promise<string> {
        if (!(await this.isRoom(roomId))) return;
        const room = await this.redisService.getRoom(roomId);
        return room.host.nickName;
    }

    async getRoomHostId(roomId: string): Promise<string> {
        if (!(await this.isRoom(roomId))) return;
        const room = await this.redisService.getRoom(roomId);
        return room.host.socketId;
    }

    async setRoomHost(roomId: string, socketId: string): Promise<void> {
        if (!(await this.isRoom(roomId))) return;
        const room = await this.redisService.getRoom(roomId);
        room.host.socketId = socketId;
        await this.redisService.setRoom(roomId, room);
    }

    // 카메라: 새로운 방 만들기
    async createRoom(
        roomId: string,
        hostName: string,
        hostId: string,
    ): Promise<void> {
        const newRoomValue = new RoomValueDto(hostName, hostId);
        await this.redisService.setRoom(roomId, newRoomValue);
    }

    // 카메라: 방에 입장하기
    async joinRoom(
        roomId: string,
        memberNickname: string,
        memberSocketId: string,
    ): Promise<void> {
        if (!(await this.isRoom(roomId))) return;

        const room = await this.redisService.getRoom(roomId);
        room.members.push(new User(memberNickname, memberSocketId));
        await this.redisService.setRoom(roomId, room);
    }

    // 카메라: 방의 멤버들 리스트 꺼내기
    async getAllMembers(roomId: string): Promise<User[]> {
        if (!(await this.isRoom(roomId))) return;

        const room = await this.redisService.getRoom(roomId);
        return room.members;
    }

    // 사진 찍기 준비
    async initPrevPicture(roomId: string, setId: string) {
        if (!(await this.isRoom(roomId))) return;
        const room = await this.redisService.getRoom(roomId);

        room.prevPictures[setId] = new Array<PrevPicture>();
        await this.redisService.setRoom(roomId, room);
    }

    async takePrevPicture(
        roomId: string,
        setId: string,
        picture: string,
        socketId: string,
    ) {
        if (!(await this.isRoom(roomId))) return;
        const room = await this.redisService.getRoom(roomId);

        if (room.prevPictures[setId]) {
            room.prevPictures[setId].push(
                new PrevPicture(setId, picture, socketId),
            );
        } else {
            console.log('takePrevPicture() :: 잘못된 setID:', setId);
        }
        await this.redisService.setRoom(roomId, room);
    }

    async getPrevPicSize(roomId: string, setId: string): Promise<number> {
        if (!(await this.isRoom(roomId))) return;
        const room = await this.redisService.getRoom(roomId);
        return room.prevPictures[setId].length;
    }

    async removePrevPicture(roomId: string) {
        if (!(await this.isRoom(roomId))) return;
        const room = await this.redisService.getRoom(roomId);
        // 삭제 작업 아직 구현 안됨
        await this.redisService.setRoom(roomId, room);
    }

    async getPrevPicture(
        roomId: string,
        setId: string,
    ): Promise<Array<PrevPicture>> {
        if (!(await this.isRoom(roomId))) return;
        const room = await this.redisService.getRoom(roomId);
        return room.prevPictures[setId];
    }

    // 카메라: 방에 찍은 사진 보관하기
    async takePicture(roomId: string, picNo: string, picture: string) {
        if (!(await this.isRoom(roomId))) return;

        const pictureValue = new PictureValue(picture);
        const room = await this.redisService.getRoom(roomId);

        // 첫번째로 찍은 사진에 모든 멤버를 다 넣어줌
        if (room.pictures.size === 1) {
            for (let i = 0; i < room.members.length; i++) {
                pictureValue.viewers.push(room.members[i]);
            }
        }

        if (room.pictures === null) {
            console.log('[ERROR] takePicture(): room.pictures === undefined');
        } else {
            room.pictures[picNo] = pictureValue;
        }
        await this.redisService.setRoom(roomId, room);
    }

    // 카메라: 찍은 사진 목록 모두 꺼내오기
    async getAllPictures(roomId: string) {
        if (!(await this.isRoom(roomId))) return;
        const room = await this.redisService.getRoom(roomId);
        return room.pictures;
    }

    // 사진선택: 찍은 사진의 선택 여부 변경하기
    async selectPicture(roomId: string, picNo: string) {
        if (!(await this.isRoom(roomId))) return;

        const room = await this.redisService.getRoom(roomId);
        if (room.pictures[picNo]) {
            let selectFlag = room.pictures[picNo].selected;
            room.pictures[picNo].selected = !selectFlag;
            await this.redisService.setRoom(roomId, room);
        } else {
            console.log(`picNo ${picNo}는 없어요..`);
        }
    }

    // 꾸미기: 선택된 사진들만 불러오기
    async getSelectedPictures(
        roomId: string,
    ): Promise<Map<string, PictureValue>> {
        const room = await this.redisService.getRoom(roomId);
        const pictures = room.pictures;
        let selectedPictures = new Map<string, PictureValue>();

        for (const [picNo, pic] of Object.entries(pictures)) {
            if (pic.selected) {
                selectedPictures[picNo] = pic;
            }
        }
        return selectedPictures;
    }

    // 꾸미기: 첫번째 사진에 viewer다 넣기
    async initPictureViewers(roomId: string) {
        if (!(await this.isRoom(roomId))) return;
        const room = await this.redisService.getRoom(roomId);

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

    // 꾸미기: 사진의 viewer 추가하기
    async addPictureViewer(
        roomId: string,
        socketId: string,
        nickname: string,
        imgIdx: string,
    ) {
        if (!(await this.isRoom(roomId))) return;

        const room = await this.redisService.getRoom(roomId);
        room.pictures[imgIdx].viewers.push(new User(nickname, socketId));

        await this.redisService.setRoom(roomId, room);
    }

    // 꾸미기: 사진의 viewer 삭제하기
    async deletePictureViewer(
        roomId: string,
        socketId: string,
        imgIdx: string,
    ) {
        if (!(await this.isRoom(roomId))) return;

        const room = await this.redisService.getRoom(roomId);

        if (!room.pictures[imgIdx]) return;
        for (let i = 0; i < room.pictures[imgIdx].viewers.length; i++) {
            if (room.pictures[imgIdx].viewers[i].socketId === socketId) {
                room.pictures[imgIdx].viewers.splice(i, 1);
                break;
            }
        }

        await this.redisService.setRoom(roomId, room);
    }

    // 꾸미기: 한 사진의 viewer 리스트 꺼내기
}
