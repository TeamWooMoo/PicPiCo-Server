const Socket = {
    // SOCKET_ORIGIN: 'https://picpico.site',
    SOCKET_ORIGIN: '*',
    SOCKET_SIGNALING_CREDENTIALS: false,
    DEFAULT_ROOM: 'DEFAULT_ROOM',
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
