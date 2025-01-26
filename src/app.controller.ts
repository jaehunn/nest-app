import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Model 별 Module 생성.
 * $ nest g resource posts
 */

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
