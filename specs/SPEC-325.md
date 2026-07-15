# SPEC-325 : Integration Aggregate Implementation

Version: 0.1
Status: Approved
Date: 2026-07-15

---

# 목표

Integration Aggregate의 구현 계약을 정의한다.

---

# 경계

- Aggregate Root: IntegrationProfile
- Value Object: IntegrationType, IntegrationConfig
- Entity: 없음

---

# 명령

- CreateIntegrationProfile(name, type, config)
- UpdateIntegrationConfig(id, config)
- ActivateIntegration(id)
- SuspendIntegration(id)

---

# 조회

- GetIntegration(id)
- ListIntegrations(type?)
- ListActiveIntegrations()

---

# 이벤트

- IntegrationProfileCreated
- IntegrationActivated
- IntegrationSuspended

---

# 규칙

- type은 resolume | osc | midi | webhook | custom 중 하나.
- config는 type별 필수 키를 가진다.
- suspend 후에는 자동 실행을 막는다.
- 활성 Integration은 단일 인스턴스로 제한할 수 있다.

---

# 패키지 구조

packages/core/src/domain/integration/
- IntegrationType.ts
- IntegrationConfig.ts
- IntegrationRepository.ts

packages/core/src/application/
- command/IntegrationCommand.ts
- query/IntegrationQuery.ts

packages/core/src/infrastructure/repository/
- InMemoryIntegrationRepository.ts
