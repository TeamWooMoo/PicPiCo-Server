type picNo = string;

export interface RoomValueDto {
    host: string;
    members: Array<string>;
    pictures: Map<picNo, PictureValue>;
}

export interface PictureValue {
    picture: string; // image data or image url
    viewers: [];
    selected: boolean;
}
