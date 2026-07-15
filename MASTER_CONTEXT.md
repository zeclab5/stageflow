# StageFlow - MASTER CONTEXT

Version: 0.1
Status: Approved
Date: 2026-07-15

---

# 이 문서의 역할

MASTER_CONTEXT.md는 StageFlow 프로젝트에 참여하는 모든 AI(Claude, ChatGPT, Hermes 등)가 가장 먼저 읽어야 하는 문서이다.

이 문서는 프로젝트의 존재 이유, 목표, 원칙, 아키텍처, 현재 상태, 그리고 작업 규칙을 정의한다.

---

# 프로젝트 존재 이유

기존 공연 제작 프로그램은 각각 특정 기능만 처리한다. StageFlow는 이들을 하나의 Workflow로 연결한다.

---

# 핵심 목표

- 공연 제작 시간 단축
- AI의 공연 제작 과정 자연스러운 통합
- 공연 제작 노하우의 데이터 축적
- 반복 작업 자동화

---

# 장기 비전

- 공연 산업의 운영 플랫폼
- 공연 제작 Workflow 플랫폼
- AI 협업 플랫폼

---

# 개발 원칙 (절대 변경 금지)

1. Architecture First
2. Specification First
3. Documentation Before Implementation
4. DDD (Domain Driven Design)
5. Specification Driven Development
6. Plugin First
7. API First
8. AI Provider Independent

---

# 개발 프로세스

Idea → Specification → Review → Implementation → Testing → Review → Merge → Release

이 프로세스를 순서대로 따른다. 건너뛰지 않는다.

---

# 아키텍처 (Freeze 0.1)

- Hexagonal Architecture
- DDD
- Event Driven
- Plugin Architecture

아키텍처는 쉽게 변경하지 않는다. 변경이 필요하면 RFC를 작성한다.

---

# 문서 관리 원칙

- README.md : 프로젝트 소개
- MASTER_CONTEXT.md : 모든 AI가 가장 먼저 읽는 컨텍스트 문서
- PROJECT_CONTEXT.md : 현재 프로젝트 맥락
- SPEC-000~ : 공식 설계 문서
- ADR : Architecture Decision Record
- RFC : 설계 변경 제안
- 새로운 아이디어는 Future Backlog로 이동

---

# Claude 개발 규칙

- 반드시 Specification을 먼저 읽는다.
- Architecture를 임의로 변경하지 않는다.
- 변경이 필요하면 RFC를 작성한다.
- 모든 구현은 DDD를 따른다.
- 모든 외부 프로그램은 Plugin으로 연결한다.
- AI 모델에 종속되지 않는다.

---

# AI 역할 분담

- Founder : 최종 의사결정
- ChatGPT : CTO / Architecture / Specification / Review / Roadmap
- Claude : Lead Developer / Implementation / Refactoring / Testing
- Hermes : Automation / Agent / Tool / Local Workflow

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

# 현재 상태

Stage : Genesis
Repository : Initialized
Architecture : Freeze 0.1
Status : Foundation Documentation
다음 작업 : PROJECT_CONTEXT.md
