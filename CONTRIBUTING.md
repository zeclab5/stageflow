# CONTRIBUTING

## 문서 작성 원칙

- 모든 문서는 Markdown으로 작성한다.
- 문서는 현대적, 간결, 명확해야 한다.
- Architecture 결정은 ADR에 기록한다.
- 설계 변경 제안은 RFC에 기록한다.
- 모든 작업 전에 TAG에 맞는 SPEC을 참조한다.

## 코드 작성 원칙

- DDD를 준수한다.
- Architecture에 위반되는 코드는 merge하지 않는다.
- 모든 외부 시스템은 Plugin으로만 연결한다.
- AI Provider 종속 코드를 작성하지 않는다.

## Commit Message 규칙

- Prefix: feat, fix, docs, refactor, test, build, ci, chore

## 브랜치 전략

- main : production
- develop : integration
- feature/SPEC-001 등

## Pull Request 규칙

- SPEC과 구현 결과를 명시한다.
- 변경 범위를 최소화한다.
- 변경 이유를 반드시 작성한다.

## 이슈 작성 규칙

- 사용자 관점에서 단일 책임으로 작성한다.
- 태그를 반드시 지정한다.
- 사본 또는 대안 프로세스를 제안할 경우 steps를 명시한다.

## 개발 프로세스 순서

Idea → Specification → Review → Implementation → Testing → Review → Merge → Release

## 관련 문서

- README.md
- MASTER_CONTEXT.md
- PROJECT_CONTEXT.md
- ROADMAP.md
- TASK-000.md
