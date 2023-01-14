import { Injectable } from '@nestjs/common';
import { RoomValueDto, PictureValue } from './rooms.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class RoomsService {
    // 카메라: 새로운 방 만들기
    createRoom(roomId: string): void {}

    // 카메라: 방에 멤버 입장하기
    joinRoom(roomId: string, member: string): void {}

    // 카메라: 방의 멤버들 리스트 꺼내기
    getAllMembers(roomId: string): Array<string> {
        return;
    }

    // 카메라: 방에 찍은 사진 보관하기
    // takePicture(): uuid {}

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
