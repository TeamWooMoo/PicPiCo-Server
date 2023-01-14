import { Controller, Get, Header, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authservice: AuthService) {}

    @Get('kakaoLogin')
    @Header('Content-Type', 'text/html')
    getKakaoLoginPage(): string {
        return `
      <div>
        <h1>카카오 로그인</h1>
        <form action="/auth/kakaoLoginLogic" method="GET">
          <input type="submit" value="카카오로그인" />
        </form>
        <form action="/auth/kakaoLogout" method="GET">
          <input type="submit" value="카카오로그아웃 및 연결 끊기" />
        </form>
      </div>
    `;
    }

  @Get('kakaoLoginLogic')
  kakaoLoginLogic(@Res() res): void {
    const _hostName = 'https://kauth.kakao.com';
    const _restApiKey = '40bf5ef38bca8060ebfe393174bc7a72'; 
    const _redirectUrl = 'http://143.248.219.121:3000/auth/kakaoLoginLogicRedirect';
    const url = `${_hostName}/oauth/authorize?client_id=${_restApiKey}&redirect_uri=${_redirectUrl}&response_type=code`;
    return res.redirect(url);

  }
  
  @Get('kakaoLoginLogicRedirect')
  kakaoLoginLogicRedirect(@Query() qs, @Res() res): void {
    //qs.code = 인가 코드 
    const _restApiKey = '40bf5ef38bca8060ebfe393174bc7a72'; 
    const _redirect_uri = 'http://143.248.219.121:3000/auth/kakaoLoginLogicRedirect';
    const _hostName = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${_restApiKey}&redirect_uri=${_redirect_uri}&code=${qs.code}`;
    const _headers = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    };
    this.authservice
      .login(_hostName, _headers)
      .then((e) => {
        this.authservice.setToken(e.data['access_token']); 
        res.redirect('/auth/getuserinfo');
      })
      .catch((err) => {
        console.log(err);
        return res.send('error');
      });
  }

    @Get('getuserinfo')
    @Header('Content-Type', 'text/html')
    async getuserinfo(@Res() res: Response): Promise<any> {
        this.authservice.getUserInfo().then((e) => {
            const user_id = e.data['id'];
            const user_nickname = e.data['properties']['nickname'];

            res.redirect(
                `/auth/giveuserinfo?nickname=${user_nickname}&id=${user_id}`,
            );
        });
    }

    @Get('giveuserinfo')
    async giveuserinfo(@Query() qs, @Res() res: Response): Promise<any> {
        const id = qs.id;
        const nickname = qs.nickname;

        const jwt = await this.authservice.validateUser(id, nickname);
        res.setHeader('Authorization', 'Bearer' + jwt.accessToken);
        res.redirect(`/users/login?nickname=${nickname}&id=${id}`);
    }

    @Get('kakaoLogout')
    kakaoLogout(@Res() res): void {
        console.log(`LOGOUT TOKEN : ${this.authservice.accessToken}`);
        this.authservice
            .deleteLog()
            .then((e) => {
                return res.send(`
          <div>
            <h2>로그아웃 완료(연결끊기)</h2>
            <a href="/auth/kakaoLogin">메인 화면으로</a>
          </div>
        `);
            })
            .catch((e) => {
                console.log(e);
                return res.send('DELETE ERROR');
            });
    }
}
