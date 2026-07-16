# DECISIONS

| Decision ID | Title | Date | Description | Reason | Impact | Status | Related Documents |
|---|---|---|---|---|---|---|---|
| D-001 | Plugin-first external integration | 2026-07-15 | 외부 장비/서비스 연동은 plugins/로만 제한 | 장비 변경에도 코어 안정성 유지 | Medium | Accepted | PROJECT_OPERATING_SYSTEM.md, specs/SPEC-300.md |
| D-002 | SQLite local persistence | 2026-07-15 | 기본 저장소로 SQLite 채택 | Vercel/로컬 동일 운영 가능 | High | Accepted | docs/pr-strategy.md |
| D-003 | Single source of truth in public/content | 2026-07-15 | works/blog 메타는 public/content 기준 | 사이트와 데이터 구조 단일화 | High | Accepted | docs/content-sync-policy.md |
| D-004 | x-api-key auth | 2026-07-15 | API 인증은 x-api-key + Bearer | 배포 환경 단순화 | Medium | Accepted | apps/api/src/auth.ts |
| D-005 | Vercel single endpoint | 2026-07-15 | web server 단일 경로로 통합 배포 | preview/production 자동화 | High | Accepted | vercel.json, apps/web/src/server.ts |
