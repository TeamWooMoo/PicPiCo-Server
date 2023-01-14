const Socket = {
    // SOCKET_ORIGIN: 'https://picpico.site',
    SOCKET_ORIGIN: '*',
    // SOCKET_ORIGIN: 'http://192.249.31.25:3000',
    SOCKET_SIGNALING_CREDENTIALS: false,
    DEFAULT_ROOM: 'DEFAULT_ROOM',
};

const MongoDB = {
    MONGO_URL: 'mongodb://localhost/nest',
    DATABASE_CONNECTION: 'DATABASE_CONNECTION',
    USER_PROVIDE: 'USER_MODEL',
};

const KakaoLoginLogic = {
    _hostName: 'https://kauth.kakao.com',
};

const Kakao = {
    _restApiKey: '40bf5ef38bca8060ebfe393174bc7a72',
    _redirectUrl: 'https://picpico-server.site/auth/kakaoLoginLogicRedirect',
    kakaoLoginLogic: KakaoLoginLogic,
};

const JWT = {
    SECRET: 'secretsandokkymcaxiosecretsandokkymacs',
};

export const Config = {
    socket: Socket,
    mongoDb: MongoDB,
    Kakao: Kakao,
    JWT: JWT,
};
export default Config;
