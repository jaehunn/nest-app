import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';

@Module({
  // imports 는 다른 모듈을 가져온다.
  // cli 를 사용하면 자동으로 설정됨.
  imports: [PostsModule],

  controllers: [AppController],
  providers: [AppService],
})

// 그럼 imports 하는게 없는 AppModule 은 등록된지 어떻게 알지?
// main.ts
export class AppModule {}
