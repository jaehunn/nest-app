// 1. request > authorization header > token
// 2. token 을 파싱하고 email 과 password 를 추출한다.
// 3. 찾아낸 사용자를 요청 객체에 붙힌다. > 요청 트랜잭션에서는 요청 헤더에서 추출할 수 있도록
// req.user 로 트랜잭션 내 함수에서 접근 가능하도록

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

// pipe 와 비슷함

// CanActivate
@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  // override
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // auth service 기능을 어떻게 접근할 수 있지? > constructor inject

    const request = context.switchToHttp().getRequest();

    const rawToken = request.headers['authorization'];

    if (!rawToken) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }

    // service 각각에서 예외 처리하도록
    const token = await this.authService.extractTokenFromHeader(rawToken, true);

    const credentials = await this.authService.decodeBasicToken(token);

    const user = await this.authService.authenticateWithEmailAndPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (!user) {
      throw new UnauthorizedException('유저 정보가 없습니다.');
    }

    request.user = user;

    return true;
  }
}
