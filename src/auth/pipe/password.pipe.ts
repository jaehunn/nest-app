import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

// @Injectable()
// export class PasswordPipe implements PipeTransform {
//   // metadata type
//   transform(value: string, _: ArgumentMetadata) {
//     // 예외 처리
//     // 길이를 반복적으로 쓴다면? 재사용성을 높여보자.
//     if (value.toString().length > 8) {
//       throw new BadRequestException('비밀번호는 8자 이상이어야 합니다.');
//     }

//     return value;
//   }
// }

// 파이프 멤버로 추상화

@Injectable()
export class MaxLengthPipe implements PipeTransform {
  constructor(private readonly maxLength: number) {}
  transform(value: string) {
    if (value.toString().length > this.maxLength) {
      throw new BadRequestException(
        `최대 길이는 ${this.maxLength}자 이하여야 합니다.`,
      );
    }

    return value;
  }
}

@Injectable()
export class MinLengthPipe implements PipeTransform {
  constructor(private readonly minLength: number) {}
  transform(value: string) {
    if (value.toString().length < this.minLength) {
      throw new BadRequestException(
        `최소 길이는 ${this.minLength}자 이상이어야 합니다.`,
      );
    }

    return value;
  }
}
