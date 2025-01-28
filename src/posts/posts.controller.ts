import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostType, PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-auth.guard';
import { User } from 'src/users/decorator/user.decorator';

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

  // private route 적용해야함.
  // access token 검증이 성공한 경우를 전제해야함.
  @Post()
  @UseGuards(AccessTokenGuard)
  async createPost(
    // guard 에서 담은 요청 객체 접근
    // @Request() req: any,
    // @User 는 AccessTokenGuard 에 의존함.
    @User('id') userId: UserType,

    // @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
    // default pipe
    // 왜 인스턴스화를 했는가.
    // api route 실행마다 계속 새로 생김.
    // 클래스면 IoC Container 에서 자동 생성 > nest 가 해주느냐에 대한 여부만 다름.
    // @Body('isPublic', new DefaultValuePipe(true)) isPublic: boolean,
  ): Promise<PostType> {
    // author 를 따로 받지 않아도 된다.
    // 토큰 정보에 포함됨.

    return await this.postsService.createPost(userId, title, content);
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
