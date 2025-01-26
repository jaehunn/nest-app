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
  async getPosts(): Promise<PostType[]> {
    return await this.postsService.getPosts();
  }

  @Get(':id')
  async getPost(@Param('id') id: string): Promise<PostType> {
    return await this.postsService.getPostById(Number(id));
  }

  @Post()
  async createPost(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ): Promise<PostType> {
    return await this.postsService.createPost(author, title, content);
  }

  @Patch(':id')
  async updatePost(
    @Param('id') id: string,
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ): Promise<PostType> {
    return await this.postsService.updatePost(
      Number(id),
      author,
      title,
      content,
    );
  }

  // @Put(':id')
  // updatePost(@Param('id') id: number, @Body() post: Post): Post {
  //   posts[id] = post;
  //   return post;
  // }

  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<string> {
    return await this.postsService.deletePost(Number(id));
  }
}
