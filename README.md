# dog jump 🐾

> 
<main align="center">
    <h3 align="left">귀여운 강아지와 함께하는 점프 게임!</h3> 
</main>

강아지를 점프시켜 장애물을 피해 최고 점수를 달성해보세요!
<br />

## 🎮 게임하기

🔗 **[https://run-jump-dog.vercel.app](https://run-jump-dog.vercel.app)**

<br />

## 🕹️ 게임 플레이 방법

| 키 | 동작 |
|:---:|:---:|
| `←` / `L` | 왼쪽 이동 |
| `→` / `R` | 오른쪽 이동 |
| `스페이스바` / `JUMP 버튼` | 점프 |

**게임 진행 방법:**

1. 화면에서 **Start** 버튼을 눌러 게임을 시작합니다.
2. 키보드 방향키(또는 L / R 버튼)로 강아지를 좌우로 움직입니다.
3. 스페이스바(또는 JUMP 버튼)를 눌러 장애물을 피해 점프합니다.
4. 장애물에 부딪히지 않고 최대한 오래 살아남아 최고 점수를 기록하세요!

<br />

## 🛠️ 기술 스택

| 분류 | 기술 |
|:---|:---|
| **Framework** | Next.js |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Utility** | dayjs |
| **Deployment** | Vercel |

<br />

## 📁 프로젝트 구조

```
dog-jump/
├── app/                  # Next.js App Router
│   ├── layout.tsx        # 루트 레이아웃
│   ├── page.tsx          # 메인 페이지
│   └── ...
├── public/               # 정적 파일 (이미지, 아이콘 등)
├── next.config.ts        # Next.js 설정
├── tailwind.config.*     # Tailwind CSS 설정
├── tsconfig.json         # TypeScript 설정
├── eslint.config.mjs     # ESLint 설정
└── package.json
```

<br />

## 🚀 설치 및 실행 방법

### 사전 요구사항

- Node.js 18.x 이상
- npm 또는 yarn

### 설치

```bash
# 레포지토리 클론
git clone https://github.com/shimdokite/dog-jump.git

# 디렉토리 이동
cd dog-jump

# 의존성 설치
npm install
```

### 실행

```bash
# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 접속하세요.

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

<br />

## 📄 라이선스

이 프로젝트는 [MIT 라이선스](./LICENSE)를 따릅니다.
