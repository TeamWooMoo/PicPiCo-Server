export class RoomValueDto {
    host: string;
    members: Array<string>;
    pictures: Map<string, PictureValue>;

    constructor(host_: string) {
        this.host = host_;
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
