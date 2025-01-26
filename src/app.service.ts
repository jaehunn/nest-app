import { Injectable } from '@nestjs/common';

// @Injectable 는 DI 될 수 있다를 뜻한다.
// providers 로 사용되려면 @Injectable 가 있어야 한다.
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
