import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bycrypt from 'bcrypt';

import { JWT_SECRET } from './const/auth.const';

export interface User {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * payload (1) email (2) sub - id (3) type - access_token | refresh_token
   *
   * Pick<Model> 은 Model 의 속성. 이라는 문맥을 나타내서 좋다.
   */
  signToken(user: User, isRefreshToken: boolean) {
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

  async authenticateWithEmailAndPassword(user: User) {
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

  async loginWithEmail(user: User) {
    const exsitingUser = await this.authenticateWithEmailAndPassword(user);

    return this.loginUser(exsitingUser);
  }

  async registerWithEmail(user: User & { nickname: string }) {
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
