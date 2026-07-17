# StageFlow

공연 제작을 위한 AI Native Platform

---

## 목표

공연 제작 시간을 단축한다.
AI를 공연 제작 과정에 자연스럽게 통합한다.
공연 제작 노하우를 데이터로 축적한다.
반복 작업을 자동화한다.

## 비전

공연 산업의 운영 플랫폼.
공연 제작 Workflow 플랫폼.
AI 협업 플랫폼.

## 핵심 가치

- 기존 프로그램을 대체하는 것이 아니다.
- 여러 프로그램을 하나의 Workflow로 연결한다.
- Architecture First, Spec First, DDD.
- Plugin First, API First, AI Provider Independent.

## 빠른 시작

1. 환경 변수 복사: `cp .env.example .env`
2. API 키 설정: `.env`의 `API_KEY`에 원하는 값 입력
3. 의존성 설치: `npm install`
4. 빌드: `npm run build`
5. 린트: `npm run lint`
6. 테스트: `npm test`

## Vercel 배포

### Web (Vercel)
1. [Vercel Dashboard](https://vercel.com/new)에서 GitHub 저장소 `zeclab5/stageflow` Import
2. Project Settings
   - Root Directory: `.`
   - Framework Preset: `Other`
   - Build Command: `npm run build`
   - Install Command: `npm install`
3. Environment Variables 등록:
   - `API_BASE`: 배포된 API 서버 주소. 예: `https://stageflow-api.zeclab.net`
   - `API_KEY`: API 키
4. Deploy 클릭 -> 도메인 확인 -> Preview URL 확인

### API (별도 배포)
API 서버는 별도로 배포:
- Render/Railway/Fly.io 등 Node.js 호스팅 사용
- 포트: `3101`
- 명령: `cd apps/api && PORT=3101 node dist/server.js`
- Root Directory: StageFlow 루트로 지정하고 빌드 본체만 배포
- 환경변수: `API_KEY` 등록

로컬 실행:
- API: `cd apps/api && PORT=3101 node dist/server.js`
- Web: `cd apps/web && API_BASE=http://localhost:3101 PORT=3000 node dist/server.js`

참고: [Vercel Project Settings](https://vercel.com/docs/projects/environment-variables) / [Node.js Runtime](https://vercel.com/docs/functions/runtimes/node-js)

## 문서 작성 순서

README.md
MASTER_CONTEXT.md
PROJECT_CONTEXT.md
SPEC-000 Foundation
SPEC-100 Product
SPEC-200 Domain
SPEC-300 Architecture
Database / API / AI / SDK / Deployment

## 상태

Stage : Genesis
Version : 0.1
Architecture : Freeze 0.1

## 라이선스

Private
