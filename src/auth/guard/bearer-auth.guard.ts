import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from '../auth.service';

@Injectable()
class BearerAuthGuard implements CanActivate {
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
    const token = await this.authService.extractTokenFromHeader(
      rawToken,
      false,
    );

    const result = await this.authService.verifyToken(token);

    // 유저 찾기
    const user = await this.authService.getUserByEmail(result.email);

    if (!user) {
      throw new UnauthorizedException('유저 정보가 없습니다.');
    }

    request.user = user;
    request.token = token;
    request.tokenType = result.type; // access_token / refresh_token

    // access_token / refresh_token 이냐를 판단하는 로직을 따로 빼자.

    return true;
  }
}

@Injectable()
export class AccessTokenGuard extends BearerAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if (req.tokenType !== 'access_token') {
      throw new UnauthorizedException('Access token 이 아닙니다.');
    }

    return true;
  }
}

@Injectable()
export class RefreshTokenGuard extends BearerAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if (req.tokenType !== 'refresh_token') {
      throw new UnauthorizedException('Refresh token 이 아닙니다.');
    }

    return true;
  }
}
