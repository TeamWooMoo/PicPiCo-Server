import { JwtService } from '@nestjs/jwt';
import { Payload } from './security/payload.interface';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    check: boolean;
    accessToken: string;
    private http: HttpService;
    constructor(
        private jwtservice:JwtService,
    ) {
    this.check = false;
    this.http = new HttpService();
    this.accessToken = '';
    
  }


  loginCheck(): void {
    this.check = !this.check;
    return;
  }

  async validateUser(_id:number,_nickname:string): Promise<{accessToken:string}|undefined> {
    const payload: Payload = { id:_id ,nickname:_nickname };
    return {
        accessToken: this.jwtservice.sign(payload)
    }
  }
  async login(url: string, headers: any): Promise<any> {
    return await this.http.post(url, '', { headers }).toPromise();
  }

  setToken(token: string): boolean {
    this.accessToken = token;
    return true;
  }

  async getUserInfo(): Promise<any> {

    const _url = 'https://kapi.kakao.com/v2/user/me';
    const _header = {
        Authorization: `bearer ${this.accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }

    return await this.http.post(_url,'', { headers: _header }).toPromise();
  
  }

  async logout(): Promise<any> {
    const _url = 'https://kapi.kakao.com/v1/user/logout';
    const _header = {
      Authorization: `bearer ${this.accessToken}`,
    };
    return await this.http.post(_url, '', { headers: _header }).toPromise();
  }
  async deleteLog(): Promise<any> {
    const _url = 'https://kapi.kakao.com/v1/user/unlink';
    const _header = {
      Authorization: `bearer ${this.accessToken}`,
    };
    return await this.http.post(_url, '', { headers: _header }).toPromise();
  }

}
