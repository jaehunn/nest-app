import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import bycrypt from 'bcrypt';

import { JWT_SECRET } from './const/auth.const';

export interface User {
  id: string;
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * 인가 프로세스
   * 1. 로그인/회원가입시 acc / ref token 발급
   * 2. basic auth 형태로 인증 (username:password + base64)
   * 3. * 인가가 적용되어야하는 api route 에 (bearer + access token)
   * 4. token 검증으로 사용자가 누구인지 파악가능 sub 값으로 프로필 추출 가능
   * 5. expire 된다. verify() 에서 인증 미통과됨. access token 토큰 재발급 로직 필요.
   *
   * basic 이거나 bearer 면 토큰 추출
   */
  async extractTokenFromHeader(header: string, isBasic: boolean) {
    const [type, token] = header?.split(' ') ?? [];

    if (type === 'Basic' || type === 'Bearer') {
      return token ?? null;
    }

    return undefined;
  }

  async decodeBasicToken(token: string) {
    // TODO: Buffer.from()
    const decoded = Buffer.from(token, 'base64').toString('utf-8');

    const [email, password] = decoded.split(':');

    return { email, password };
  }

  async verifyToken(token: string) {
    return this.jwtService.verify(token, {
      secret: JWT_SECRET,
    });
  }

  // 새로 발급
  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.verifyToken(token);

    // sub, email, type
    if (decoded?.type !== 'refresh_token') {
      throw new UnauthorizedException('Invalid token');
    }

    return this.signToken(...decoded, isRefreshToken);
  }

  /**
   * payload (1) email (2) sub - id (3) type - access_token | refresh_token
   *
   * Pick<Model> 은 Model 의 속성. 이라는 문맥을 나타내서 좋다.
   */
  signToken(user: Pick<User, 'email' | 'password'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh_token' : 'access_token',
    };

    this.jwtService.sign(payload, {
      // FIXME: to env variable
      secret: JWT_SECRET,

      // sec
      expiresIn: isRefreshToken ? 3600 : 360,
    });

    return this.jwtService.sign(payload);
  }

  loginUser(user: User) {
    const accessToken = this.signToken(user, false);
    const refreshToken = this.signToken(user, true);

    return { accessToken, refreshToken };
  }

  async authenticateWithEmailAndPassword(
    user: Pick<User, 'email' | 'password'>,
  ) {
    // TODO: UserModule 로 검증

    const exsitingUser = await this.userService.findByEmail(user.email);

    if (!exsitingUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // bycrypt 로 비밀번호 검증
    // password - original
    // exsitingUser.password - hashed
    if (bycrypt.compare(user.password, exsitingUser.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return exsitingUser;
  }

  async loginWithEmail(user: Pick<User, 'email' | 'password'>) {
    const exsitingUser = await this.authenticateWithEmailAndPassword(user);

    return this.loginUser(exsitingUser);
  }

  async registerWithEmail(
    user: Pick<User, 'email' | 'password'> & { nickname: string },
  ) {
    // hash round: 10
    // round=10 = 초당 10번 = 10 hashes/seconds
    const hashedPassword = await bycrypt.hash(user.password, 10);

    // bycrypt.hash() = salt 는 자동생성됨.

    // TODO: createUser()
    // userRepository.exist() 로 존재 여부 검증 (nickname / email)
    const newUser = await this.userService.createUser({
      ...user,
      password: hashedPassword,
    });

    return this.loginUser(newUser);
  }
}
