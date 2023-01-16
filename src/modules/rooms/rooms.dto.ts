export class RoomValueDto {
    host: { nickName: string; socketId: string };
    members: Array<string>;
    pictures: Map<string, PictureValue>;

    constructor(host_: string) {
        this.host.nickName = host_;
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
