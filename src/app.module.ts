import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { PostsModel } from './posts/entities/posts.entity';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';

@Module({
  // imports 는 다른 모듈을 가져온다.
  // cli 를 사용하면 자동으로 설정됨.
  imports: [
    PostsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '0000',
      database: 'postgresdb',

      // 연동할 모델을 설정할 것.
      entities: [PostsModel],

      // nestjs typeorm 코드와 db 싱크를 맞출거냐.
      // prod 에서는 false 하는 게 좋다. (자동싱크 해제)
      synchronize: true,
    }),
    AuthModule,
    CommonModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})

// 그럼 imports 하는게 없는 AppModule 은 등록된지 어떻게 알지?
// main.ts
export class AppModule {}
