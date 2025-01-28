import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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

  // url queryparam 이 numstring 으로 검증하고 싶다 -> ParseIntPipe 사용 (pipe)
  // ParseIntPipe 검증했으면 id: number 로 잡아도 됨. 변환도 되니까.
  // 만약 검증 싪패 시 500 이 아닌 BadRequestException 발생 (400)
  @Get(':id')
  async getPost(@Param('id', ParseIntPipe) id: number): Promise<PostType> {
    return await this.postsService.getPostById(id);
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
    @Param('id', ParseIntPipe) id: number,
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
  async deletePost(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return await this.postsService.deletePost(id);
  }
}
