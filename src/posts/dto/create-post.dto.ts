import { PickType } from '@nestjs/mapped-types';
import { PostsModel } from '../entities/posts.entity';

// body 각각을 class 로 관리해보자.

// data transfer object
// body 로 받으면 서버에서 효율적으로 관리하는 객체

// api route 특화보다 좀 더 일반적인 이름으로

// pipe 로 검증도 가능하지만 dto 로 할 수 있음.

// Pick, Omit, Partial, Intersection
// PickType, OmitType, PartialType, IntersectionType

export class CreatePostDto extends PickType(PostsModel, ['title', 'content']) {
  // ...
}

/** @see https://github.com/typestack/class-validator */
