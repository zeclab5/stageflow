# SPEC-327 : API Routing & Contracts Implementation

Version: 0.1
Status: Approved
Date: 2026-07-15

---

# 목표

StageFlow API 레이어 구현 계약을 정의한다.

---

# 범위

- apps/api/
- /api/v1 prefix
- Project, Scene, Prompt, Asset, Generation, Integration 리소스

---

# 규칙

- 모든 라우트는 Application Service/Query를 통해 Domain에 접근한다.
- 요청/응답 변환은 Adapter에서 처리한다.
- 인증/인가 공통 미들웨어를 둔다.
- 에러 포맷은 SPEC-500과 일치한다.

---

# 계약 원칙

- 성공: { data, meta }
- 실패: { error: { code, message, details? } }
- 페이지네이션은 cursor 기반으로 통일한다.

---

# 구현 단위

- Router 생성
- Controller 스텁
- DTO 변환기
- 미들웨어 등록
