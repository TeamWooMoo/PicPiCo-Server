const Socket = {
    SOCKET_ORIGIN: 'https://nanasmemo.shop',
    SOCKET_SIGNALING_CREDENTIALS: true,
};

const MongoDB = {
    MONGO_URL: 'mongodb://localhost/nest',
    DATABASE_CONNECTION: 'DATABASE_CONNECTION',
    USER_PROVIDE: 'USER_MODEL',
};

export const Config = {
    socket: Socket,
    mongoDb: MongoDB,
};
export default Config;
