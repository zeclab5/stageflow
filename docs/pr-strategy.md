# PR Strategy

## Branch Strategy

- `main`: 운영 브랜치, 항상 배포 가능 상태 유지
- `develop`: 통합 브랜치, 다음 릴리즈 기능 모음
- `feature/*`: 기능 개발, `develop` 기준 생성 -> `develop` PR
- `fix/*`: 버그 픽스, `main` 또는 `develop` 기준 생성 -> 각 브랜치 PR
- `release/*`: 릴리즈 준비, `develop` -> `main` 머지 전용
- `hotfix/*`: 긴급 패치, `main` 기준 생성 -> `main` PR

## PR Rules

- 제목: `type(scope): short description`
  - 예: `feat(api): add /plugins route`
  - type: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- 설명: 변경 이유, 스크린샷/로그, 테스트 방법
- 사이즈: 400 lines 이하 권장, 초과 시 분할 PR
- 의존성: `npm run build && npm run lint && npm test` 필수
- 리뷰어: 최소 1명 승인
- 머지: squash merge, 커밋 메시지 정제

## CI Gates

- PR 생성/업데이트 시 자동 실행:
  - `npm run lint`
  - `npm run build`
  - `cd packages/core && npx jest --config jest.config.js`
- 실패 시 머지 불가
- `main` push 시 Vercel 프리뷰 배포 연동 권장

## Deployment

- `main` 머지 -> Vercel Production 배포
- `develop` 머지 -> Vercel Preview 배포
- 환경변수: Vercel Dashboard에서 관리
  - Production/Preview 분리 가능
