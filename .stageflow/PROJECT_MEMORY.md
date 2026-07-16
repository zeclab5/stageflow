# PROJECT_MEMORY

## 프로젝트 시작 배경

StageFlow는 공연 제작 현장에서 흩어진 도구와 데이터를 하나의 워크플로우로 통합하기 위해 시작되었다. 반복되는 운영, 프롬프트/자산/장면 관리, 외부 장비 연동이 분산되어 있고, 제작자가 아닌 구현자 중심 도구가 많았다.

## 해결하려는 문제

- 공연 제작 데이터의 구조화 부재
- 반복 작업의 수동 처리
- 외부 장비/툴과의 연동 부재
- 사이트와 작업 데이터의 단절

## 장기 비전

공연 산업의 운영 플랫폼.
공연 제작 Workflow 플랫폼.
AI 협업 플랫폼.

## 핵심 가치

- 기존 프로그램을 대체하는 것이 아니다.
- 여러 프로그램을 하나의 Workflow로 연결한다.
- Architecture First, Spec First, DDD.
- Plugin First, API First, AI Provider Independent.

## 개발 철학

- Specification First
- Domain Driven Design
- Plugin Isolation
- Traceability
- 작은 단위 커밋 + 검증 우선

## 절대 변경하지 않을 원칙

- 외부 연동은 플러그인만 허용
- API First
- 단일 source of truth 원칙
- 보안: 실제 secrets 저장 금지

## 프로젝트 성공 기준

- 로컬 환경에서 빌드/린트/테스트가 모두 통과
- Vercel 배포 가능
- 공연 제작 워크플로우가 코드로 표현 가능

## 주요 기술 선택 이유

- TypeScript: 생산성, 배포 생태계
- Express: API/웹 단일 서버 가능
- SQLite: 로컬/서버리스 배포와 호환
- Vercel: 정적+함수 혼용 배포 용이
- EventBus: 확장성 있는 도메인 이벤트
