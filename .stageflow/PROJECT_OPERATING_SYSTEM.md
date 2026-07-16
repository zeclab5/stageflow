# PROJECT_OPERATING_SYSTEM

StageFlow Development OS의 헌법. 모든 작업은 아래 규칙을 우선한다.

## 1. 프로젝트 철학

- 공연 제작 운영 플랫폼
- Architecture First, Spec First, DDD
- Plugin First, API First, AI Provider Independent
- 여러 프로그램을 하나의 Workflow로 연결

## 2. 개발 원칙

- Specification First: 구현 전 SPEC 문서화
- Domain Driven Design: Aggregate, Event, Command, Query 분리
- Plugin Isolation: 외부 연동은 plugins/만 사용
- Traceability: 변경은 docs/specs와 동기화
- 작은 단위 커밋 + 검증 우선

## 3. AI 역할

- Hermes, ChatGPT 등 모든 AI는 이 문서를 기준으로 협업
- 규칙 충돌 시 PROJECT_OPERATING_SYSTEM이 우선
- AI는 승인 대신 실행을 우선하되,高风险 변경 전 사용자 확인 권장

## 4. 승인 절차

- 기본 실행: 승인 요청 없이 진행 후 보고
-高风险 변경: 데이터 손실, 배포, 보안 변경은 보고 후 실행
- 사용자가 명시적으로 중단 지시한 경우 즉시 중단

## 5. 리뷰 절차

- 변경 후 build, lint, test를 필수 실행
- 실패 시 원인 분석 → 수정 → 재실행
- 동일 오류 2회 반복 시 전략 변경 후 사용자 보고

## 6. Sprint 규칙

- Sprint Goal은 단일 문장
- Task는 모두 Sprint Template 사용
- Sprint 종료 조건을 명시

## 7. Branch 전략

- main: 배포 가능 상태 유지
- 기능 작업은 main에서 진행, 가능한 경우 즉시 푸시

## 8. Release 정책

- 버전은 SemVer 또는 자체 단계 표기 사용
- main 머지 후 Vercel 자동 배포
