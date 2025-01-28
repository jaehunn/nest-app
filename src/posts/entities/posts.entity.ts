import { IsString, Length } from 'class-validator';
import { BaseEntity } from '../../common/entity/base.entity';
import { Column, Entity } from 'typeorm';
import { lenghtValidationMessage } from 'src/common/validation-message/lenght-validation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';

// PostsModel 이라는 table 을 생성함.
@Entity()
export class PostsModel extends BaseEntity {
  // table 에는 무조건 primary key 가 있어야함.
  // 데이터를 접근하기 위한 고유한 id 를 보장하도록 해야한다.
  // @PrimaryGeneratedColumn 생성할때마다 1씩 올라가게 설정됨.

  // run -> posts_model 로 테이블 생성되어 있는 것 확인 완료.
  // @PrimaryGeneratedColumn()
  // id: number;

  @Column()
  author: string;

  @Column()
  @IsString({
    // 메시지 커스텀
    message: 'title 은 문자열이어야 합니다.',
  })
  @Length(1, 20, {
    // message: 'title 은 1자 이상 20자 이하여야 합니다.',
    // 공통화
    message: lenghtValidationMessage,
  })
  title: string;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;

  // 데이터가 언제 생성되었는지. 언제 업데이트 되었는지 자동 생성시키고 싶다.
  // utc time (base time)
  // seoul time (kst) = utc time + 9
  // @CreateDateColumn()
  // createdAt: Date;

  // @UpdateDateColumn()
  // updatedAt: Date;
}
