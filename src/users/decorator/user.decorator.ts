import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

// @User('id') = data = 'id'
export const User = createParamDecorator(
  (data: keyof UserType | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      // 유저를 찾을 수 없는 것은 서버 에러
      throw new InternalServerErrorException(
        'User 데코레이터는 AccessTokenGuard 가 적용된 라우트에서만 사용할 수 있습니다.',
      );
    }

    if (data != null) {
      return user[data];
    }

    return user;
  },
);
