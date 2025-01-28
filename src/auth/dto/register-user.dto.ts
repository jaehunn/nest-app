import { PickType } from '@nestjs/mapped-types';

export class RegisterUserDto extends PickType(UsersModel, [
  'email',
  'password',
  'nickname',
]) {
  // ...
}
