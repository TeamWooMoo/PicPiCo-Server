import { SubscribeMessage, WebSocketGateway, ConnectedSocket, MessageBody, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { MyServer, MySocket } from '../socket.interface';
import { Config } from '../../../config/configuration';
import { RoomsService } from '../../rooms/rooms.service';
import { v1 as uuid } from 'uuid';

@WebSocketGateway({
    cors: {
        origin: Config.socket.SOCKET_ORIGIN,
        credentials: Config.socket.SOCKET_SIGNALING_CREDENTIALS,
    },
})
export class CameraGateway {
    constructor(private readonly roomService: RoomsService) {}

    @WebSocketServer()
    server: MyServer;

    @SubscribeMessage('add_member')
    async handleAddMember(@ConnectedSocket() client: MySocket, @MessageBody() data: any) {
        const [roomId, newNickName] = data;

        if (!(await this.roomService.isRoom(roomId))) {
            client.disconnect(true);
        }

        client.nickName = newNickName;
        client.myRoomId = roomId;

        await this.roomService.joinRoom(roomId, newNickName, client.id);
        const nickNameArr = await this.roomService.getAllMembers(roomId);

        client.emit('reset_member', nickNameArr);
        client.to(client.myRoomId).emit('reset_member', nickNameArr);
    }

    // 셔터 누른 사람
    @SubscribeMessage('click_shutter')
    async handleTakePic(@ConnectedSocket() client: MySocket, @MessageBody() data: any) {
        const setIdx = data;
        console.log('[ click_shutter] on');
        console.log('[ click_shutter] setIdx', setIdx);

        this.roomService.initPrevPicture(client.myRoomId, setIdx);

        client.emit('click_shutter', setIdx);
        client.to(client.myRoomId).emit('click_shutter', setIdx);
    }

    // 셔터 누른 사람 포함 전부
    @SubscribeMessage('send_pic')
    async handleBeingTaken(@ConnectedSocket() client: MySocket, @MessageBody() data: any) {
        if (!(await this.roomService.isRoom(client.myRoomId))) {
            client.disconnect(true);
        }

        console.log('[ send_pic ] on');

        const [setId, picture, orderId] = data;
        const room = client.myRoomId;

        const fileName = await this.base64ToImage(picture, client.id);
        await this.roomService.takeRawPicture(room, setId, fileName, client.id, orderId);
    }

    @SubscribeMessage('done_take')
    async handleDoneTake(@ConnectedSocket() client: MySocket, @MessageBody() data: any) {
        console.log('[ done_take ] on');

        const [roomId, socketId] = data;

        if (!(await this.roomService.isRoom(roomId))) {
            client.disconnect(true);
        }

        // 호스트만 사진 촬영 다음단계로 넘어갈 수 있음
        if (client.id === (await this.roomService.getRoomHostId(roomId))) {
            const rawPictures = await this.roomService.getAllRawPictures(roomId);
            const resultImages = new Map<string, string>();

            for (const [setId, rawPictureArray] of Object.entries(rawPictures)) {
                rawPictureArray.sort((a, b) => {
                    return a.order - b.order;
                });

                const resultBase64 = await this.composite(rawPictureArray);
                resultImages[setId] = resultBase64;
            }

            client.emit('done_take', resultImages);
            client.to(roomId).emit('done_take', resultImages);

            console.log('[ done_take ] emit done_take');

            await this.roomService.takeAllPictures(roomId, resultImages);

            // if (pictures.size === 4) {
            //     // 4장 미만으로 찍었을 경우 4장 이상으로 찍어야 한다는 사실 알려주는 이벤트 있어야함
            //     // 클라이언트에서 어떻게 출력되는지 확인 필요
            //     // pictures가 가지고 있는 이미지 src가 전달 후에도 이미지로 출력될 수 있는지 확인
            // } else {
            //     // 4장 미만이라 다음 단계로 못 넘어간다는 이벤트
            // }
        } else {
            client.emit('permission_denied');

            console.log('[ done_take ] permission_denied');
        }
    }

    async composite(rawPictures) {
        const sharp = require('sharp');
        const imageToBase64 = require('image-to-base64');

        const path = './static/';
        const type = 'png';
        const resultFile = uuid() + 'result.png';
        let images = [];

        for (let i = 0; i < rawPictures.length; i++) {
            let curPic = rawPictures[i];
            let fileName = curPic.fileName;
            images.push({ input: `${path}${fileName}.${type}` });
        }

        let resultBase64: string;

        try {
            if (images.length > 1) {
                await sharp(images[0]['input'])
                    .composite(images)
                    .toFile(path + resultFile);
            } else {
                await sharp(images[0]['input']).toFile(path + resultFile);
            }
        } catch (e) {
            console.log('띠용 삐용');
            console.log(e);
        }

        await imageToBase64(path + resultFile)
            .then((bs: string) => {
                resultBase64 = 'data:image/png;base64,' + bs;
                for (let i = 0; i < images.length; i++) {
                    this.removeFile(images[i]['input']);
                }
                this.removeFile(path + resultFile);
            })
            .catch((e) => {
                console.log('웨용 뛔용');
                console.log(e);
            });

        if (!resultBase64) {
            console.log('resultBase64 >>> ', resultBase64.length > 50);
        }

        return resultBase64;
    }

    async base64ToImage(base64: string, socketId: string): Promise<string> {
        const base64ToImage = require('base64-to-image');
        const path = './static/';
        let fileName = `file_${socketId}_${Date.now()}`;
        let option = {
            fileName: fileName,
            type: 'png',
        };
        await base64ToImage(base64, path, option);
        return fileName;
    }

    // 파일 삭제
    async removeFile(fileName: string) {
        const fs = require('fs');
        fs.unlink(fileName, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log(fileName + '을 삭제했어요');
            }
        });
    }
}
