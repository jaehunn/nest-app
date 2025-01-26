import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // AppModule 을 등록한다.
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
}
bootstrap();
