export class RoomValueDto {
    hostId: string;
    hostNickname: string;
    members: Array<string>;
    pictures: Map<string, PictureValue>;

    constructor(host_: string, id_: string) {
        this.hostNickname = host_;
        this.hostId = id_;
        this.members = new Array<string>();
        this.pictures = new Map<string, PictureValue>();
    }
}

export class PictureValue {
    picture: string; // image data or image url
    viewers: Array<string>;
    selected: boolean;

    constructor(picture: string) {
        this.picture = picture;
        this.viewers = new Array<string>();
        this.selected = false;
    }
}

export type Host = {
    nickName: string;
    socketId: string;
};
