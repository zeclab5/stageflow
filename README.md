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

- 이 저장소를 GitHub에 연결한 뒤 Vercel에서 Import한다.
- Vercel Project Settings > Environment Variables에 다음을 등록한다:
  - `API_KEY`: API 인증 키
  - `RESOLUME_HOST`: Resolume 호스트
  - `RESOLUME_PORT`: Resolume 포트
- `vercel.json`이 Node.js 서버리스 진입점(`apps/web/src/server.ts`)을 사용하도록 설정되어 있다.

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
