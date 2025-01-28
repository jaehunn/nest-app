import { Body, Controller, Headers, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { MaxLengthPipe, MinLengthPipe } from './pipe/password.pipe';

// access token -> expired -> rotate token -> return access token
// refresh token -> expired -> rotate token -> return refresh token

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  async loginEmail(@Headers('authorization') rawToken: string) {
    // 1. token extract
    const token = await this.authService.extractTokenFromHeader(
      rawToken,
      false,
    );

    // 2. parsing token
    const credentials = await this.authService.decodeBasicToken(token);

    // 3. login
    return this.authService.loginWithEmail(credentials);
  }

  @Post('token/access')
  async tokenAccess(@Headers('authorization') rawToken: string) {
    // 1. token extract (bearer)
    const token = await this.authService.extractTokenFromHeader(rawToken, true);

    // 2. rotate token
    const newToken = this.authService.rotateToken(token, false);

    return {
      accessToken: newToken,
    };
  }
  @Post('token/refresh')
  async tokenRefresh(@Headers('authorization') rawToken: string) {
    // 1. token extract (bearer)
    const token = await this.authService.extractTokenFromHeader(rawToken, true);

    // 2. rotate token
    const newToken = this.authService.rotateToken(token, true);

    return {
      refreshToken: newToken,
    };
  }

  // @Post('login')
  // async login(
  //   @Body('email') email: string,
  //   @Body('password') password: string,
  // ) {
  //   return this.authService.loginWithEmail({
  //     email,
  //     password,
  //   });
  // }

  @Post('register')
  async register(
    @Body('email') email: string,
    // length 검증하려면? custom pipe
    // 파이프 연쇄.
    // 인스턴스로 생성하면 멤버를 커스텀하게 설정 가능.
    @Body('password', new MaxLengthPipe(8), new MinLengthPipe(3))
    password: string,
    @Body('nickname') nickname: string,
  ) {
    // pipe 로 유효성 검증

    return this.authService.registerWithEmail({
      email,
      password,
      nickname,
    });
  }
}
