export interface RoomValueDto {
    host: string;
    members: Array<string>;
    pictures: Map<string, PictureValue>;
}

export interface PictureValue {
    picture: string;
    viewers: [];
    selected: boolean;
}
