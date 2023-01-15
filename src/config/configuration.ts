const CORS = {
    // ORIGIN: 'http://192.168.0.84:3000', // JNL
    // ORIGIN: 'http://192.168.0.49:3000', // KJH
    // ORIGIN: 'http://192.168.0.15:3000', // CDB
    ORIGIN: [
        'http://192.168.0.84:3000',
        'http://192.168.0.49:3000',
        'http://192.168.0.15:3000',
    ],
    // ORIGIN: 'https://picpico.site', // [진짜 서버] 배포용
    // ORIGIN: '*', // [진짜 서버] 개발용
    CREDENTIALS: true,
};

const Socket = {
    // SOCKET_ORIGIN: 'http://192.168.0.84:3000', // JNL
    SOCKET_ORIGIN: [
        'http://192.168.0.84:3000',
        'http://192.168.0.49:3000',
        'http://192.168.0.15:3000',
    ],
    // SOCKET_ORIGIN: 'http://192.168.0.49:3000', // KJH
    // SOCKET_ORIGIN: 'https://picpico.site', // [진짜 서버] 배포용
    // SOCKET_ORIGIN: '*', // [진짜 서버] 개발용
    SOCKET_SIGNALING_CREDENTIALS: true,
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
    cors: CORS,
    socket: Socket,
    mongoDb: MongoDB,
    Kakao: Kakao,
    JWT: JWT,
};
export default Config;
