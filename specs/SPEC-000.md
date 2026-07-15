# SPEC-000 : Foundation

Version: 0.2
Status: Approved
Date: 2026-07-15

---

# 프로젝트 개요

StageFlow는 공연 제작을 위한 AI Native Platform이다. 기존 프로그램을 대체하는 것이 목적이 아니다. 기존 공연 제작 프로그램들을 하나의 Workflow로 연결하는 플랫폼을 만드는 것이 목표이다.

---

# 목표

공연 제작 시간을 단축한다.
AI를 공연 제작 과정에 자연스럽게 통합한다.
공연 제작 노하우를 데이터로 축적한다.
반복 작업을 자동화한다.

---

# 장기 비전

StageFlow는 공연 산업의 운영 플랫폼, 공연 제작 Workflow 플랫폼, AI 협업 플랫폼을 목표로 한다.

---

# 개발 원칙

Architecture First
Specification First
Documentation Before Implementation
DDD (Domain Driven Design)
Specification Driven Development
Plugin First
API First
AI Provider Independent

---

# 개발 프로세스

Idea → Specification → Review → Implementation → Testing → Review → Merge → Release
문서 작성과 코드 구현은 이 순서를 따르며, 뒤로 돌아가지 않는다.

---

# 저장소 규칙

- main : production
- develop : integration
- feature/SPEC-XXX : feature branch

---

# Commit 규칙

- Prefix: feat, fix, docs, refactor, test, build, ci, chore
- 변경 사유를 본문에 포함
- 공식 문서 변경은 docs prefix를 우선 사용

---

# PR 규칙

- SPEC 링크를 포함
- 변경 이유를 필수로 작성
- build / lint / test 증거를 포함

---

# 품질 정책

1. Specification이 없는 구현은 merge하지 않는다.
2. 외부 시스템은 Plugin으로만 연결한다.
3. AI Provider 종속 코드는 작성하지 않는다.
4. 아키텍처는 Freeze 후 RFC 없이 변경하지 않는다.
5. 변경 필요시 RFC를 작성한다.

---

# 문서 관리 원칙

- README.md: 프로젝트 소개
- MASTER_CONTEXT.md: 모든 AI가 가장 먼저 읽는 문서
- SPEC은 공식 설계 문서
- ADR은 Architecture Decision Record
- RFC는 설계 변경 제안
- 새로운 아이디어는 Future Backlog로 이동

---

# 문서 작성 순서

1. README.md
2. MASTER_CONTEXT.md
3. PROJECT_CONTEXT.md
4. SPEC-000 Foundation
5. SPEC-100 Product
6. SPEC-200 Domain
7. SPEC-300 Architecture
8. SPEC-400 Database
9. SPEC-500 API
10. SPEC-600 Plugin
11. SPEC-700 AI
12. SPEC-800 SDK / Deployment

---

# 이슈 규칙

- 단일 책임으로 작성한다.
- 태그를 지정한다.

---

# 변경 이력

2026-07-15 : 초기 생성
