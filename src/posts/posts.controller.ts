import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';

interface Post {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

let posts: Post[] = [
  {
    id: 1,
    author: 'John Doe',
    title: 'Hello World',
    content: 'This is a test post',
    likeCount: 10,
    commentCount: 5,
  },
  {
    id: 2,
    author: 'Jane Doe',
    title: 'Hello World 2',
    content: 'This is a test post 2',
    likeCount: 10,
    commentCount: 5,
  },
  {
    id: 3,
    author: 'John Doe',
    title: 'Hello World 3',
    content: 'This is a test post 3',
    likeCount: 10,
    commentCount: 5,
  },
];

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts(): Post[] {
    return posts;
  }

  @Get(':id')
  getPost(@Param('id') id: string): Post {
    // path parameter is always string
    // id: number 로는 찾아지지 않는다.

    const post = posts.find((post) => post.id === Number(id));

    // 찾을 수 없으면 찾을 수 없다고 알려줘야한다.
    if (!post) {
      throw new NotFoundException('message 응답필드를 설정해줄 수 있습니다.');
    }

    return post;
  }

  @Post()
  createPost(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ): Post {
    // 생성 시 기본값이 설정되는 값이 아니면 받아야한다.

    const defaultPost: Post = {
      id: posts[posts.length - 1].id + 1,
      author: '',
      title: '',
      content: '',
      likeCount: 0,
      commentCount: 0,
    };

    const post: Post = {
      ...defaultPost,
      author,
      title,
      content,
    };

    posts = [...posts, post];

    // 데이터를 얼마나 응답했느냐로 과금함.
    // 최소한의 정보를 반환해주는 것이 과금 절약에 좋다.
    return post;
  }

  @Patch(':id')
  updatePost(
    @Param('id') id: number,

    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ): Post {
    // body 값이 전부 필수값은 아니어도 된다.

    const post = posts.find((post) => post.id === Number(id));

    if (!post) {
      throw new NotFoundException('message 응답필드를 설정해줄 수 있습니다.');
    }

    if (author) {
      post.author = author;
    }

    if (title) {
      post.title = title;
    }

    if (content) {
      post.content = content;
    }

    posts = posts.map((prev) => (post.id === Number(id) ? post : prev));

    return post;
  }

  // @Put(':id')
  // updatePost(@Param('id') id: number, @Body() post: Post): Post {
  //   posts[id] = post;
  //   return post;
  // }

  @Delete(':id')
  deletePost(@Param('id') id: string): string {
    const post = posts.find((post) => post.id === Number(id));

    if (!post) {
      throw new NotFoundException('message 응답필드를 설정해줄 수 있습니다.');
    }

    posts = posts.filter((post) => post.id !== Number(id));

    return id;
  }
}
