# SPEC-200 : Domain

Version: 0.1
Status: Approved
Date: 2026-07-15

---

# 목표

StageFlow의 핵심 도메인 모델, Aggregate, Entity, Value Object, Domain Event를 정의한다.

---

# 도메인 경계

- Project
- Scene
- Prompt
- Asset
- Generation
- Integration

---

# 주요 Aggregate

## Project

- Entity: Project
- Value Object: ProjectMetadata, ProjectStatus
- Event: ProjectCreated, ProjectUpdated

## Scene

- Entity: Scene
- Value Object: Timeline, Trigger
- Event: SceneCreated, SceneOrderChanged

## Prompt

- Entity: Prompt
- Value Object: PromptTemplate, PromptVariableMap
- Event: PromptCreated, PromptVersionUpdated

## Asset

- Entity: Asset
- Value Object: AssetType, AssetMetadata
- Event: AssetRegistered, AssetTagUpdated

## Generation

- Entity: GenerationJob
- Value Object: GenerationResult, GenerationProviderRef
- Event: GenerationRequested, GenerationCompleted, GenerationFailed

## Integration

- Entity: IntegrationProfile
- Value Object: PluginConfig, ConnectionStatus
- Event: IntegrationConnected, IntegrationDisconnected

---

# 규칙

- 모든 상태 변경은 Domain Event로 표현한다.
- 외부 데이터는 Repository를 통해만 접근한다.
- 비즈니스 규칙은 Domain Service에 위치한다.

---

# 변경 이력

2026-07-15 : 초기 생성
