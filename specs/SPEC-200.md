# SPEC-200 : Domain

Version: 0.2
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
- State: draft, active, closed
- Command: CreateProject, UpdateProject, CloseProject
- Query: GetProject, ListProjects

## Scene

- Entity: Scene
- State: name, order, projectId
- Command: CreateScene, RenameScene, ReorderScene
- Query: ListScenes

## Prompt

- Entity: Prompt
- State: template, version
- Command: CreatePrompt, UpdatePromptTemplate
- Query: ListPrompts

## Asset

- Entity: Asset
- Value: AssetType(image, video, audio, text)
- State: uri, status
- Command: RegisterAsset, RetireAsset
- Query: ListAssets

## GenerationJob

- Entity: GenerationJob
- State: provider, params, status(requested, completed, failed), output, sceneId, promptId
- Command: CreateGenerationJob, UpdateGenerationStatus, AttachGenerationOutput
- Query: GetGeneration, ListGenerations

## IntegrationProfile

- Entity: IntegrationProfile
- State: name, type, config, status(draft, active, suspended)
- Command: CreateIntegrationProfile, ActivateIntegration, SuspendIntegration
- Query: GetIntegration, ListIntegrations

---

# 규칙

- 모든 상태 변경은 Domain Event로 표현한다.
- 외부 데이터는 Repository를 통해만 접근한다.
- 비즈니스 규칙은 Domain/Application Service에 위치한다.
- 모든 외부 연동은 Plugin을 통해야 한다.

---

# 변경 이력

2026-07-15 : 초기 생성
