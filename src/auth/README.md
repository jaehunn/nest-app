// payload 변경 시 signature 도 변경됨.
// signature = payload + header

// signature secret 을 알아야만
// signature payload 와 payload 를 일치시켜서 변조 가능
// 그럼 signature secret 을 서버에서 잘 보관하면 됨.

// refresh vs. access
// both jwt
// access: 인증/인가
// refresh: access 재발급

// refresh/access 생성
// basic auth
// token = username:password -> base64
// authorization: Basic <token>
// refresh + access 발급

// refresh token 사용
// authorization: Bearer <refresh-token>
// access 발급

// access token 사용
// authorization: Bearer <access-token>
// 인증/인가

// refreshing logic
// access token 만료 (401)
// access token 요청 (refresh 토큰 포함)
// 새로운 access token 으로 요청

// encryption
// bcrypt, 일부러 느림 그래서 많이 씀.
// md5,
// sha1

// 암호화 결과 - 해시 (항상 같은 인풋 같은 결과)
// db password 를 암호화해야함. (bcrypt)
// hash 는 항상 같은 해시를 뱉는다.
// 원래 비밀번호를 몰라도 됨. 받은 비밀번호로 해싱해서 해싱 결과를 비교.
// db 털려도 상관이 없어진다.

// dictionary attack
// 미리 여러 비밀번호를 해싱해놓고 db 에서 동일한 해시를 찾는다.
// 찾아지면 해싱에 해당하는 원본 비밀번호를 찾아내는 식.

// salt
// dictionary attack 방지
// salt 문자는 랜덤함. password + salt 로 추가해서 해싱
// salt 를 모르면 dictionary attack 불가능.

// salt 가 털리더라도 bcrypt 연산 자체가 느리게 설계되어서 문제가 없다.
// 의도적으로 느리게 설계됨 > 연산이 느리면 사실상 공격이 불가능하다
