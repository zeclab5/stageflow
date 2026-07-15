# SPEC-500 : API

Version: 0.1
Status: Approved
Date: 2026-07-15

---

# 목표

StageFlow의 API 계약, 버전 정책, 인증, 에러 처리 규칙을 정의한다.

---

# 원칙

- API First
- 내부 API와 외부 API를 분리한다.
- AI Provider와 직접 연결되는 API는 추상화 계층을 거친다.

---

# API 범위

- Project API
- Scene API
- Prompt API
- Asset API
- Generation API
- Integration API

---

# 버전 정책

- URL prefix: /api/v1
- Header: API-Version
- Deprecation 정책: 최소 2개 버전 지원

---

# 에러 정책

- 공통 에러 포맷 사용
- 비즈니스 에러와 시스템 에러를 분리한다.

---

# 변경 이력

2026-07-15 : 초기 생성
