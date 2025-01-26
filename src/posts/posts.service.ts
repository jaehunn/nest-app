import { Injectable, NotFoundException } from '@nestjs/common';

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

export let posts: PostType[] = [
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

@Injectable()
export class PostsService {
  // Architecture, 효율적인 코드 관리 방식
  // controller 는 로직을 처리하지않는다. service 에서 로직을 처리한다.
  // controller 는 service 로직을 호출하기만 한다.

  // 그냥 controller 에서 service 로 단순히 옮긴건데. 머가 달라졌나.
  // 1. controller 가 간단해졌다.
  // 2. 다른 모듈에서 재사용할 수 있다.
  // 3. 어떤 상황에서든 받아서 로직을 처리한다. path param 이든 body 든 상관없어진다.

  getPosts(): PostType[] {
    return posts;
  }

  getPost(id: string): PostType {
    const post = posts.find((post) => post.id === Number(id));

    if (!post) {
      throw new NotFoundException('');
    }

    return post;
  }

  createPost(author: string, title: string, content: string): PostType {
    const defaultPost: PostType = {
      id: posts[posts.length - 1].id + 1,
      author: '',
      title: '',
      content: '',
      likeCount: 0,
      commentCount: 0,
    };

    const post: PostType = {
      ...defaultPost,
      author,
      title,
      content,
    };

    posts = [...posts, post];

    return post;
  }

  updatePost(
    id: string,
    author: string,
    title: string,
    content: string,
  ): PostType {
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

  deletePost(id: string): string {
    const post = posts.find((post) => post.id === Number(id));

    if (!post) {
      throw new NotFoundException('message 응답필드를 설정해줄 수 있습니다.');
    }

    posts = posts.filter((post) => post.id !== Number(id));

    return id;
  }
}
