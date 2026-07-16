---
Title: APPLICATION_SERVICE_DESIGN
Version: 1.0
Status: Review
Author: Hermes
Reviewer: ChatGPT (CTO)
Created: 2026-07-16
Updated: 2026-07-16
Category: domain
Tags: [application-service, domain]
---

# APPLICATION_SERVICE_DESIGN

> Application Service는 도메인 로직을 조합해 사용 사례를 구현한다.
> Domain Service, Aggregate, Repository를 조율한다.
> 트랜잭션 경계를 가진다.

## Responsibilities
- 프레젠테이션/인프라 계층과 도메인 계층 연결
- Command/Query 분리 유지
- 다수 Aggregate 오케스트레이션
- 도메인 이벤트 발행 조율

## Application Service Rules
- Domain 규칙을 넣지 않는다.
- Aggregate 직접 변경을 피한다.
- Repository 직접 사용은 application 계층에서만 허용.

## Application Services

### ProjectApplicationService
- use cases: create project, update project, close project, get project, list projects
- input/output: DTO

### SceneApplicationService
- use cases: create scene, rename scene, reorder scene, remove scene, list scenes
- input/output: DTO

### CueApplicationService
- use cases: trigger cue, complete cue, fail cue, list cues, get cue
- input/output: DTO

### PlaybackApplicationService
- use cases: start playback, stop playback, finish playback, get playback status, list playbacks
- input/output: DTO

### AssetApplicationService
- use cases: register asset, retire asset, update asset meta, list assets, get asset
- input/output: DTO

### OutputApplicationService
- use cases: create output, disable output, route output, list outputs, get output
- input/output: DTO

### PluginApplicationService
- use cases: register plugin, load plugin, disable plugin, list plugins, get plugin
- input/output: DTO

### WorkspaceApplicationService
- use cases: create workspace, archive workspace, list workspaces, get workspace
- input/output: DTO

### PromptApplicationService
- use cases: create prompt, update prompt template, list prompts, get prompt
- input/output: DTO

### AIAgentApplicationService
- use cases: start agent, stop agent, list agents, get agent status
- input/output: DTO

### AIWorkflowApplicationService
- use cases: start workflow, retry workflow, get workflow status, list workflows
- input/output: DTO

### AIMemoryApplicationService
- use cases: store memory, search memory, get memory
- input/output: DTO

### AuthApplicationService
- use cases: login, logout, issue token, get current user, list permissions
- input/output: DTO

### OrganizationApplicationService
- use cases: create organization, add member, remove member, get organization, list organizations
- input/output: DTO

### StorageApplicationService
- use cases: upload file, remove file, get file url, list files
- input/output: DTO

### MediaApplicationService
- use cases: convert media, validate media, get media spec, list media specs
- input/output: DTO

### SynchronizationApplicationService
- use cases: start sync, stop sync, get sync status, list sync history
- input/output: DTO

### ConfigurationApplicationService
- use cases: update config, rollback config, get config, list config history
- input/output: DTO
