# Asset Pipeline Engine
Status: Accepted
Updated: 2026-07-16

## Context
StageFlow는 `public/` 하드코딩 동기화에 의존한다. 자동 프로젝트 자산 관리 시스템을 위해 단일 파이프라인으로 통합한다.

## Contract
- 입력: projectId, directory=`public/assets`
- 감시 디렉토리: `public/assets/{projectId}`
- 출력: PipelineRun aggregate + emitted domain events
- 규칙:
  - 감시는 polling 기반으로 chokidar 외부 의존성 없이 구현한다.
  - metadata, thumbnail, cache, search index는 DB/파일시스템 저장이어야 한다.
  - 자산 등록 전 단계에서 실패하면 해당 파일은 failed로 기록하고 다음 polling에서 재시도한다.
  - 같은 파일의 중복 실행은 file fingerprint로 보호한다.

## Section Contract
1. Context
2. Problem Statement
3. Goals / Non-Goals
4. Architecture
5. Data Model Additions
6. Pipeline Contracts
7. Observability / Telemetry
8. Failure Modes / Recovery
9. Rollout Plan
10. Decisions
