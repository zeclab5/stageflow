# SPEC-700 : SDK

Version: 0.1
Status: Approved
Date: 2026-07-15

---

# 목표

StageFlow의 SDK 범위, 제공 방식, 사용 패턴, 호환성 정책을 정의한다.

---

# 원칙

- API First 기반 SDK
- 언어 독립성을 우선 고려한다.
- SDK는 비즈니스 로직을 포함하지 않고 호출 계약만 제공한다.

---

# 제공 방식

- OpenAPI 기반 자동 생성 SDK를 기본으로 한다.
- 필요시 언어별 SDK 패키지를 추가한다.

---

# SDK 범위

- Authentication
- Project / Scene / Prompt / Asset / Generation / Integration
- Event Subscription
- Plugin Development Kit

---

# 호환성 정책

- Major version에서만 breaking change 허용.
- SDK 버전과 API 버전을 분리 관리한다.

---

# 변경 이력

2026-07-15 : 초기 생성
