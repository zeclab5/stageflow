# SPEC-326 : Event Bus Implementation

Version: 0.1
Status: Approved
Date: 2026-07-15

---

# 목표

Event Bus 구현 계약을 정의한다.

---

# 범위

- In-Memory Event Bus
- Domain Event 저장/전달
- 외부 브로커(Redis, RabbitMQ 등)는 Plugin으로만 연결

---

# 명령

- publish(event)
- subscribe(eventType, handler)

---

# 규칙

- publish은 동기/비동기 모두 허용한다.
- 구독자는 이벤트 타입 단위로 등록한다.
- 핸들러 실패는 로깅하고 계속 진행한다.

---

# 패키지 구조

packages/core/src/infrastructure/event/
- EventBus.ts
- InMemoryEventBus.ts
- DomainEvent.ts
