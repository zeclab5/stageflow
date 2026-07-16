# StageFlow 성능/보안 감사 체크리스트

## 적용 범위
- `apps/api`, `apps/web`, `packages/core`, `plugins/*`

## 보안
- [x] API 키 인증: `x-api-key`, `Authorization Bearer` 지원 (`apps/api/src/auth.ts`)
- [x] 환경 변수 분리: `.env.example` 제공, 실제 시크릿은 리포에 포함하지 않음
- [x] 에러 응답 최소화: 500 시 상세 스택 미노출 (`apps/api/src/errors.ts`)
- [x] SQLite 경로: `/tmp/stageflow-api.sqlite` 고정(`apps/api/src/container.ts`)
- [x] 컨테이너/DI: 토큰 기반 resolve, 외부 주입 불가
- [ ] Vercel 시크릿 등록 전 실제 배포 보류
- [ ] Rate limiting/throttling 도입 검토
- [ ] CORS 정책 검토 필요
- [ ] 입력 검증 (`express.json()`만 사용, 스키마 검증层 부재)

## 성능
- [x] 테스트 실행 시간 <1s (core 20tests), API 12tests <1s (local)
- [x] 핸들러/라우트 분리 (`apps/api/src/routes/*`)
- [x] 정적 파일 서빙 (`apps/web/src/server.ts`)
- [ ] 응답 캐싱(`Cache-Control`, ETag) 검토
- [ ] 파일/이미지 압축, CDN 검토

## 안정성
- [x] 포트 충돌 해소 절차(`lsof -ti:PORT | xargs kill -9`)
- [x] Build/Lint/Test 자동화 (`npm run build && npm run lint && npm run test`)
- [x] CI workflow (`lint-test`, `vercel-preview`, `vercel-production`)
- [ ] DB 마이그레이션 자동 적용 bootstrap 연동
- [ ] graceful shutdown 적용

## 권장 우선순위
1. Vercel 시크릿 등록 후 실제 배포
2. 입력 검증 library 도입(zod/joi/valibot)
3. Rate limiting/CORS 설정
4. Cache-Control 설정
