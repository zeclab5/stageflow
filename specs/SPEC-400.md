# SPEC-400 : Database

Version: 0.1
Status: Approved
Date: 2026-07-15

---

# 목표

StageFlow의 데이터 저장 구조, 관계, 규칙을 정의한다.

---

# 원칙

- 모든 비즈니스 상태는 Aggregate Root에서 관리한다.
- Repository를 통해서만 데이터에 접근한다.
- 직접 DB 접근을 허용하지 않는다.

---

# 저장 방식

- 이벤트 소싱을 기본 정책으로 고려하되, MVP에서는 상태 저장 우선으로 시작한다.
- 감사 로그는 Domain Event로부터 재구성 가능하게 설계한다.

---

# 데이터 모델 범위

- Aggregate Root 단위로 저장 단위를 분리한다.
- 외부 시스템 데이터는 Plugin 격리 레이어를 통해 접근한다.

---

# 데이터 정책

- AI 생성 결과, 외부 연동 데이터는 참조만 저장하고 원본은 외부 저장소에 둔다.
- 사용자 입력 데이터는 도메인 규칙으로 검증 후 저장한다.
- 삭제는 Soft Delete를 기본으로 한다.

---

# 관계 규칙

- Aggregate 간 참조는 ID로만 연결한다.
- Transaction 경계는 Aggregate 단위로 제한한다.
- 다중 Aggregate 업데이트는 Application Service에서 오케스트레이션한다.

---

# 변경 이력

2026-07-15 : 초기 생성
