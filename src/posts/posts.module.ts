import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsModel } from './entities/posts.entity';

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
  // forFeature 불러올 모델을 정의한다.
  // TypeOrm 이 PostsModel 과 관련된 레퍼지토리를 만들어줌.
  imports: [TypeOrmModule.forFeature([PostsModel])],

  // PostsController() 인스턴스를 넣는게 아님. 클래스로 넣고 IoC 가 알아서 인스턴스화를 한다.
  controllers: [PostsController],

  // PostsController 의 DI 인스턴스로 PostsService 를 정의했다.
  // 주입을 시켜야하는 클래스가 있으면 providers 에 설정한다.

  // PostsService 에서 PostsRepository 를 주입시키기 위해 설정한다.
  providers: [PostsService],

  // providers 에 등록된 클래스들은 IoC 컨테이너에 등록되고 관리된다.
})
export class PostsModule {}
