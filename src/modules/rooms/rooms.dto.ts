export class RoomValueDto {
    host: User;
    members: Array<User>;
    prevPictures: Map<string, Array<PrevPicture>>;
    pictures: Map<string, PictureValue>;

    constructor(host_: string, id_: string) {
        this.host = new User(host_, id_);
        this.members = new Array<User>();
        this.prevPictures = new Map<string, Array<PrevPicture>>();
        this.pictures = new Map<string, PictureValue>();
    }
}

export class Picture {
    picture: string; // image data or image url

    constructor(picture: string) {
        this.picture = picture;
    }
}

export class PrevPicture extends Picture {
    setId: string;
    socketId: string;

    constructor(setId: string, picture: string, socketId: string) {
        super(picture);
        this.setId = setId;
        this.socketId = socketId;
    }
}

export class PictureValue extends Picture {
    viewers: Array<User>;
    selected: boolean;

    constructor(picture: string) {
        super(picture);
        this.viewers = new Array<User>();
        this.selected = false;
    }
}

export class User {
    nickName: string;
    socketId: string;

    constructor(nickName: string, socketId: string) {
        this.nickName = nickName;
        this.socketId = socketId;
    }
}
