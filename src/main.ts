import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // AppModule 을 등록한다.
  const app = await NestFactory.create(AppModule);

  // global pipe
  // app 전반적으로 pipe 를 적용한다.
  // 모든 class-validator 를 적용한다.
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
