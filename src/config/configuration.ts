// ORIGIN: 'http://143.248.229.30:3000', // JNL
// ORIGIN: 'http://192.168.0.49:3000', // KJH
// ORIGIN: 'http://192.249.31.25:3000', // CDB
// ORIGIN: 'http://143.248.191.4:3000', // LWH
// ORIGIN: 'http://143.248.219.121:3000', // KSW
// ORIGIN: 'https://picpico.site', // [진짜 서버] 배포용

const CORS = {
    ORIGIN: [
        'http://143.248.229.30:3000',
        'http://192.168.0.49:3000',
        'http://143.248.191.4:3000',
        'http://143.248.219.121:3000',
        'https://picpico.site',
        'http://localhost:3001',
    ],
    CREDENTIALS: true,
};

const Socket = {
    SOCKET_ORIGIN: [
        'http://143.248.229.30:3000',
        'http://192.168.0.49:3000',
        'http://192.168.0.15:3000',
        'http://143.248.191.4:3000',
        'http://143.248.219.121:3000',
        'https://picpico.site',
        'http://localhost:3001',
    ],
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
    _restApiKey: '34973c294ce96911a4a945e71c8c7314',
    _redirectUrl: 'http://localhost:3000/auth/kakaoLoginLogicRedirect',
    kakaoLoginLogic: KakaoLoginLogic,
};

const JWT = {
    SECRET: 'secretsandokkymcaxiosecretsandokkymacs',
};

export const Config = {
    serverPort: 3000,
    cors: CORS,
    socket: Socket,
    mongoDb: MongoDB,
    Kakao: Kakao,
    JWT: JWT,
};
export default Config;
