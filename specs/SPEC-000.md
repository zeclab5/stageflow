# SPEC-000 : Foundation

Version: 0.1
Status: Approved
Date: 2026-07-15

---

# 목표

Foundation 단계에서 필요한 정책, 구조, 규칙, 템플릿을 정의한다.

---

# 참조 문서

- README.md
- MASTER_CONTEXT.md
- PROJECT_CONTEXT.md
- TASK-000.md

---

# Repository 구조

stageflow/
- README.md
- MASTER_CONTEXT.md
- PROJECT_CONTEXT.md
- ROADMAP.md
- TASK-000.md
- CONTRIBUTING.md
- CHANGELOG.md
- LICENSE
- ai/
- docs/
- specs/
- adr/
- rfc/
- research/
- apps/
- packages/
- plugins/
- services/
- tools/
- assets/
- scripts/
- .github/

---

# 문서 작성 순서

1. README.md
2. MASTER_CONTEXT.md
3. PROJECT_CONTEXT.md
4. SPEC-000 Foundation
5. SPEC-100 Product
6. SPEC-200 Domain
7. SPEC-300 Architecture
8. Database
9. API
10. AI
11. SDK
12. Deployment

---

# 문서 관리 규칙

- 향후 버전이 지정되지 않은 문서는 추가하지 않는다.
- 템플릿을 최초 1회 작성한 후 변경하지 않는다.
- 변경이 필요하면 하위 SPEC에 위임한다.

---

# 개발 프로세스

Idea → Specification → Review → Implementation → Testing → Review → Merge → Release

문서 작성과 코드 구현은 이 순서를 따르며, 뒤로 돌아가지 않는다.

---

# 품질 정책

1. Specification이 없는 구현은 merge하지 않는다.
2. 외부 시스템은 Plugin으로만 연결한다.
3. AI Provider 종속 코드는 작성하지 않는다.
4. 아키텍처는 Freeze 후 변경하지 않는다.
5. 변경 필요시 RFC를 작성한다.

---

# 저장소 규칙

- main : production
- develop : integration
- feature/SPEC-XXX : feature branch

---

# Commit 규칙

- Prefix: feat, fix, docs, refactor, test, build, ci, chore
- 필요 사유를 본문에 포함한다.

---

# 이슈 규칙

- 단일 책임으로 작성한다.
- 태그를 지정한다.

---

# PR 규칙

- SPEC 링크를 포함한다.
- 변경 이유를 필수로 작성한다.

---

# 변경 이력

2026-07-15 : 초기 생성
