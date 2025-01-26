import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

// DI 와 IoC

// A 에 B 인스턴스를 생성한다. 와 A 에 B 에 DI 한다. 는 다르다.
// DI 에서 A 는 생성마다 B 도 생성하는 게 아니라 B 를 어디에서 생성해서 인스턴스를 주입시키는 것.

// IoC 는 제어가 역전되었다는 뜻.
// 직접 생성 및 관리하는 게 역전되었다는 뜻.

// Nestjs 는 실행과 동시에 IoC Container 를 생성한다.
// 만약 DI 된 인스턴스가 있으면 IoC 컨테이너에서 생명주기를 관리하게 된다.
// -> A 에 B 의존성이 있으면 B 는 IoC 컨테이너에서 생성되고, A 에 주입된다.

// 주입받을 수 있는 클래스들을 Provider 라고 한다.
// Provider 에 Contstructor 로 DI 인스턴스들을 정의해놓으면
// IoC Container 가 찾아서 알아서 인스턴스화 하고 주입해줌. -> Nestjs 역할.

@Module({
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
