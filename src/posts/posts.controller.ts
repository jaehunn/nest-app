import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostType, PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  // private readonly 는 postService 를 선언하고,
  // this.postService 에 postsService 생성 인자를 할당하는 것을 의미한다.

  constructor(private readonly postsService: PostsService) {
    // controller 는 service 를 의존성으로 무조건 가진다.
  }

  @Get()
  getPosts(): PostType[] {
    return this.postsService.getPosts();
  }

  @Get(':id')
  getPost(@Param('id') id: string): PostType {
    return this.postsService.getPost(id);
  }

  @Post()
  createPost(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ): PostType {
    return this.postsService.createPost(author, title, content);
  }

  @Patch(':id')
  updatePost(
    @Param('id') id: string,
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ): PostType {
    return this.postsService.updatePost(id, author, title, content);
  }

  // @Put(':id')
  // updatePost(@Param('id') id: number, @Body() post: Post): Post {
  //   posts[id] = post;
  //   return post;
  // }

  @Delete(':id')
  deletePost(@Param('id') id: string): string {
    return this.postsService.deletePost(id);
  }
}
