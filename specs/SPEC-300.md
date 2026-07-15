# SPEC-300 : Architecture

Version: 0.2
Status: Approved
Date: 2026-07-15

---

# 목표

StageFlow의 아키텍처를 Hexagonal Architecture + DDD + Event Driven + Plugin Architecture로 정식 정의한다.

---

# 아키텍처 프레임워크

- Hexagonal Architecture
- DDD
- Event Driven Architecture
- Plugin Architecture

---

# 레이어 구조

## Domain Layer

- Aggregate
- Entity
- Value Object
- Domain Event
- Domain Service

## Application Layer

- Command
- Query
- Service
- Orchestrator

## Infrastructure Layer

- Repository Implementation
- Event Bus
- Persistence
- DI Container

## API Layer

- Express Router
- Validation
- Error Handling

## Plugin Layer

- Plugin Interface
- Plugin Loader
- Plugin Registry
- Plugin Descriptor

---

# 이벤트 버스 정책

- Domain Event만 발행한다.
- 핸들러는 Application 레이어에 배치한다.
- InMemoryEventBus를 기본 구현으로 사용한다.

---

# 플러그인 정책

- 모든 외부 프로그램은 Plugin으로만 연결한다.
- Plugin은 Plugin 인터페이스를 구현해야 한다.
- 플러그인 설정 변경은 PluginConfig로만 처리한다.
- PluginRegistry로 descriptor/load/shutdown을 관리한다.

---

# API 정책

- API First
- REST 컨벤션을 기본으로 한다.
- 모든 모듈은 인터페이스 기반으로 교체 가능하게 설계한다.

---

# AI 독립성 정책

- AI Provider 종속 코드를 작성하지 않는다.
- AI 기능은 서비스 계층에서 추상화한다.
- 호출부와 구현부를 분리한다.

---

# 데이터 정책

- 모든 비즈니스 상태는 Aggregate Root에서 관리한다.
- Repository를 통해서만 데이터에 접근한다.
- 직접 DB 접근 코드는 Infrastructure 레이어에 제한한다.

---

# 변경 이력

2026-07-15 : 초기 생성
