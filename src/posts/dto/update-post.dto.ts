import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsOptional, IsString } from 'class-validator';

// 상속안하는 거랑 뭔 차이지?
// CreatePostDto 맥략 추가 + CreatePostDto 필드 따라감.
export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsString()
  @IsOptional()
  // title?: string 이면 오류가 남. > PartialType
  title: string;

  @IsString()
  @IsOptional()
  author: string;
}
