import { IsString } from 'class-validator';

// data transfer object
// body 로 받으면 서버에서 효율적으로 관리하는 객체

// api route 특화보다 좀 더 일반적인 이름으로

// pipe 로 검증도 가능하지만 dto 로 할 수 있음.

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;
}
