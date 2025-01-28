import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PostsModel } from './entities/posts.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

export interface PostType {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

// 왜 데이터가 초기화되는가 > RAM

// Nestjs 코드는 HDD/SSD, 휘발이 안된다.
// 실행 시점부터 Nestjs 코드가 RAM 에 올라온다. (실행되는 것만)
// RAM 은 리셋된다. (휘발)

// 왜 써요? 빨라서
// 왜 빨라요? 메모리 접근 속도가 빠르다.

// 영구적으로 데이터를 저장해줘야함. 안지워지려면
// 명령할 수 있는 방법이 여러가지가 있지만 SQL
// Structured Query Language

// C: INSERT INTO {table} [{column}] VALUES [{value}]
// R: SELECT {column} FROM {table}
// U: UPDATE {table} SET {column} WHERE {condition}
// D: DELETE FROM {table} WHERE {condition}

@Injectable()
export class PostsService {
  constructor(
    // typeorm 으로부터 주입되는 레퍼지토리다를 알려주기 위해.
    // 태그를 해줘야함. (@InjectRepository)
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
  ) {
    // ...
  }

  // Architecture, 효율적인 코드 관리 방식
  // controller 는 로직을 처리하지않는다. service 에서 로직을 처리한다.
  // controller 는 service 로직을 호출하기만 한다.

  // 그냥 controller 에서 service 로 단순히 옮긴건데. 머가 달라졌나.
  // 1. controller 가 간단해졌다.
  // 2. 다른 모듈에서 재사용할 수 있다.
  // 3. 어떤 상황에서든 받아서 로직을 처리한다. path param 이든 body 든 상관없어진다.

  // repository 의 함수는 전부 async 임.
  async getPosts(): Promise<PostType[]> {
    return await this.postsRepository.find(); // []
  }

  async getPostById(id: number): Promise<PostType> {
    const post = await this.postsRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('message 응답필드를 설정해줄 수 있습니다.');
    }

    return post;
  }

  async createPost(author: string, body: CreatePostDto): Promise<PostType> {
    // 1. create (sync, 객체만 생성함.)
    const post = this.postsRepository.create({
      author,
      title: body.title,
      content: body.content,
      likeCount: 0,
      commentCount: 0,
    });

    // 2. save
    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  async updatePost(id: number, body: UpdatePostDto): Promise<PostType> {
    const { author, title, content } = body;

    // save
    // 1. 데이터가 없으면 생성함.
    // 2. 데이터가 있으면 변경한다.

    // 알아서 처리하지 않도록 하자.

    const post = await this.postsRepository.findOne({
      where: { id },
    });

    // 존재하지 않으면 변경하지 못함.
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

    // 변경하는 케이스만 해당한다.
    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  async deletePost(id: number): Promise<string> {
    const post = await this.postsRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('message 응답필드를 설정해줄 수 있습니다.');
    }

    await this.postsRepository.delete(id);

    return String(id);
  }
}
