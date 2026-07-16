---
Title: ENTITY_DESIGN
Version: 1.0
Status: Review
Author: Hermes
Reviewer: ChatGPT (CTO)
Created: 2026-07-16
Updated: 2026-07-16
Category: domain
Tags: [entity, domain]
---

# ENTITY_DESIGN

> Entity는 식별성(ID)을 가지며, 상태가 변경되어도 동일한 Entity로 간주된다.
> Entity는 반드시 Aggregate Root 내에서만 존재한다.
> 직접 노출하지 않고, Root를 통해서만 접근한다.

## Project Entity

### Identity
ProjectId

### Attributes
- id: ProjectId
- name: ProjectName
- status: ProjectStatus

### Behavior
- close 시 ProjectClosedEvent 발생

### Invariant
- name은 비어있을 수 없다.

## Show Entity

### Identity
ShowId

### Attributes
- id: ShowId
- projectId: ProjectId
- name: string
- status: string
- occurredAt: Date

### Behavior
- 상태 전환 시 이벤트 발행

### Invariant
- projectId는 반드시 존재한다.

## Scene Entity

### Identity
SceneId

### Attributes
- id: SceneId
- projectId: ProjectId
- name: string
- order: number

### Behavior
- rename 시 SceneRenamedEvent
- reorder 시 SceneReorderedEvent

### Invariant
- order는 project 내 unique
- projectId는 반드시 존재

## Cue Entity

### Identity
CueId

### Attributes
- id: CueId
- sceneId: SceneId
- name: string
- timelinePosition: number
- status: string

### Behavior
- trigger 시 CueTriggeredEvent
- complete 시 CueDoneEvent

### Invariant
- sceneId 존재
- timelinePosition 존재

## Timeline Entity

### Identity
TimelineId

### Attributes
- id: TimelineId
- projectId: ProjectId
- status: string
- sequences: Sequence[]

### Behavior
- publish 시 TimelinePublishedEvent

### Invariant
- sequences 최소 1개

## Sequence Entity

### Identity
SequenceId

### Attributes
- id: SequenceId
- timelineId: TimelineId
- cueIds: string[]
- order: number

### Behavior
- 순서 재배열 가능

### Invariant
- order는 timeline 내 unique

## Transition Entity

### Identity
TransitionId

### Attributes
- id: TransitionId
- fromSequenceId: SequenceId
- toSequenceId: SequenceId
- type: string

### Behavior
- 전환 효과 적용

### Invariant
- from/to는 반드시 존재

## Asset Entity

### Identity
AssetId

### Attributes
- id: AssetId
- projectId: ProjectId
- type: AssetType
- uri: string
- meta: Record<string, string>

### Behavior
- register 시 AssetRegisteredEvent
- retire 시 AssetRetiredEvent

### Invariant
- type 존재
- uri 존재

## Workspace Entity

### Identity
WorkspaceId

### Attributes
- id: WorkspaceId
- name: string
- projectId?: ProjectId
- organizationId?: OrganizationId

### Behavior
- archive 시 WorkspaceArchivedEvent

### Invariant
- project 또는 organization 중 하나 연결

## Plugin Entity

### Identity
PluginId

### Attributes
- id: PluginId
- name: string
- version: string
- status: string
- config: Record<string, string>

### Behavior
- load/unload 상태 전환

### Invariant
- name, version 존재

## Playback Entity

### Identity
PlaybackId

### Attributes
- id: PlaybackId
- cueId: CueId
- status: PlaybackStatus
- startedAt?: Date
- finishedAt?: Date

### Behavior
- start/finish/stop 상태 전환

### Invariant
- cueId 존재

## Output Entity

### Identity
OutputId

### Attributes
- id: OutputId
- name: string
- type: string
- screenId?: ScreenId
- displayId?: DisplayId
- status: OutputStatus

### Behavior
- route/unroute 제어

### Invariant
- screen 또는 display 중 하나 연결

## Screen Entity

### Identity
ScreenId

### Attributes
- id: ScreenId
- name: string
- outputId: OutputId
- resolution: string
- status: string

### Behavior
- 출력 매핑 관리

### Invariant
- outputId 존재

## Display Entity

### Identity
DisplayId

### Attributes
- id: DisplayId
- name: string
- layout: string
- outputId: OutputId
- status: string

### Behavior
- 논리 디스플레이 구성

### Invariant
- outputId 존재

## Projector Entity

### Identity
ProjectorId

### Attributes
- id: ProjectorId
- name: string
- screenId: ScreenId
- calibrationId?: CalibrationId
- status: string

### Behavior
- 장치 매핑/보정 참조

### Invariant
- screenId 존재

## User Entity

### Identity
UserId

### Attributes
- id: UserId
- name: string
- email: string
- roleId: RoleId
- status: UserStatus

### Behavior
- activate/disable

### Invariant
- roleId 존재

## Organization Entity

### Identity
OrganizationId

### Attributes
- id: OrganizationId
- name: string
- memberIds: string[]
- status: OrganizationStatus

### Behavior
- add/remove member

### Invariant
- 최소 1명의 member

## Role Entity

### Identity
RoleId

### Attributes
- id: RoleId
- name: string
- permissionIds: string[]
- status: RoleStatus

### Behavior
- 권한 집합 관리

### Invariant
- 최소 1개 permission

## Permission Entity

### Identity
PermissionId

### Attributes
- id: PermissionId
- resource: string
- action: string
- status: PermissionStatus

### Behavior
- 접근 규칙 관리

### Invariant
- resource, action 존재
