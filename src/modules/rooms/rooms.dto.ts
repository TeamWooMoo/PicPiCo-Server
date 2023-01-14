export interface RoomValueDto {
    host: string;
    members: [];
    pictures: Map<string, PictureValue>;
}

export interface PictureValue {
    picture: string;
    viewers: [];
    selected: boolean;
}
