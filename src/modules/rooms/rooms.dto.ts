export class RoomValueDto {
    host: User;
    members: Array<User>;
    prevPictures: Map<string, Array<RawPicture>>;
    pictures: Map<string, DecoPicture>;

    constructor(host_: string, id_: string) {
        this.host = new User(host_, id_);
        this.members = new Array<User>();
        this.prevPictures = new Map<string, Array<RawPicture>>();
        this.pictures = new Map<string, DecoPicture>();
    }
}

export class Picture {
    picture: string; // image data or image url

    constructor(picture: string) {
        this.picture = picture;
    }
}

export class RawPicture {
    setId: string;
    socketId: string;
    order: number;
    fileName: string;

    constructor(
        setId: string,
        fileName: string,
        socketId: string,
        order: number,
    ) {
        this.setId = setId;
        this.fileName = fileName;
        this.socketId = socketId;
        this.order = order;
    }
}

export class DecoPicture extends Picture {
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
