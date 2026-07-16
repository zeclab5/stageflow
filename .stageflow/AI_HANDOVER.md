# AI_HANDOVER

## 프로젝트 정보
- Repository: https://github.com/zeclab5/stageflow
- Branch: main
- Purpose: 공연 제작 워크플로우 플랫폼

## 현재 Sprint
- Sprint 0 Foundation (Part 2)

## 현재 Milestone
- TASK-006 ~ TASK-010 완료
- Repository 구조 확정
- GitHub Push
- Sprint 1 시작 준비

## 최근 완료 작업
- API auth 테스트 추가
- EventBus 인터페이스 확장
- Vercel CI workflow 현대화
- 성능/보안 감사 문서 작성
- Sprint 0 산출물 정리

## 현재 진행 작업
- Sprint 0 Part 2 문서화
- Web 테스트 추가 예정
- 실제 Vercel 배포 예정

## 다음 작업
- Sprint 1 Task 정의
- Web 테스트 추가
- Vercel deploy with secrets
- Resolume 실제 연동 보강

## AI 역할
- Hermes: 구현/자동화 담당
- ChatGPT(CTO): 리뷰/의사결정

## 주의사항
- 외부 연동은 plugins/만 사용
- env/.env.example는 있지만 실제 secrets는 리포에 넣지 않음
- `/tmp/stageflow-api.sqlite` 기본 경로
- container.ts bootstrapContainer은 테스트 전 호출 권장

## Repository 위치
- 로컬: /Users/jangjaeho/zeclab/StageFlow

## 필수 문서 읽기 순서
1. .stageflow/PROJECT_OPERATING_SYSTEM.md
2. .stageflow/PROJECT_MEMORY.md
3. .stageflow/DECISIONS.md
4. .stageflow/CURRENT_STATE.md
5. docs/GIT_WORKFLOW.md
6. CURRENT_STATE.md(루트)
