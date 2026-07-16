---
Title: VALUE_OBJECT_DESIGN
Version: 1.0
Status: Review
Author: Hermes
Reviewer: ChatGPT (CTO)
Created: 2026-07-16
Updated: 2026-07-16
Category: domain
Tags: [value-object, domain]
---

# VALUE_OBJECT_DESIGN

> Value Object는 식별성 대신 속성 집합으로 정의된다.
> 불변이다.
> 같은 속성 값이면 동일한 Value Object로 간주한다.

## ProjectValue Objects

### ProjectId
- type: string
- 규칙: non-empty, unique

### ProjectName
- type: string
- 규칙: 1~120 chars

### ProjectStatus
- type: enum
- values: draft, active, closed

## Show Value Objects

### ShowId
- type: string

### ShowStatus
- type: enum
- values: planned, ready, performed, archived

## Scene Value Objects

### SceneId
- type: string

### SceneOrder
- type: number
- 규칙: project 내 unique, positive integer

## Timeline Value Objects

### TimelineId
- type: string

### TimelineStatus
- type: enum
- values: draft, published, executed

## Sequence Value Objects

### SequenceId
- type: string

## Transition Value Objects

### TransitionId
- type: string

### TransitionType
- type: enum
- values: cut, crossfade, wipe

## Cue Value Objects

### CueId
- type: string

### CueStatus
- type: enum
- values: pending, triggered, done, failed

### TimelinePosition
- type: number
- 규칙: positive number or timestamp

## Asset Value Objects

### AssetId
- type: string

### AssetType
- type: enum
- values: image, video, audio, text

### AssetUri
- type: string
- 규칙: non-empty

## Workspace Value Objects

### WorkspaceId
- type: string

## Plugin Value Objects

### PluginId
- type: string

### PluginStatus
- type: enum
- values: registered, loaded, disabled

## Playback Value Objects

### PlaybackId
- type: string

### PlaybackStatus
- type: enum
- values: ready, playing, finished, stopped

## Output Value Objects

### OutputId
- type: string

### OutputStatus
- type: enum
- values: planned, active, disabled

## Screen Value Objects

### ScreenId
- type: string

### Resolution
- type: string
- 예: 1920x1080

## Display Value Objects

### DisplayId
- type: string

### Layout
- type: string
- 예: split-2x1

## Projector Value Objects

### ProjectorId
- type: string

## User Value Objects

### UserId
- type: string

### UserStatus
- type: enum
- values: invited, active, disabled

## Organization Value Objects

### OrganizationId
- type: string

### OrganizationStatus
- type: enum
- values: created, active, archived

## Role Value Objects

### RoleId
- type: string

### RoleStatus
- type: enum
- values: created, active, deprecated

## Permission Value Objects

### PermissionId
- type: string

### PermissionStatus
- type: enum
- values: created, active, deprecated

## Mapping Value Objects

### MappingId
- type: string

### MappingStatus
- type: enum
- values: defined, active, archived

## Calibration Value Objects

### CalibrationId
- type: string

### CalibrationStatus
- type: enum
- values: planned, applied, expired

## Media Value Objects

### MediaSpec
- fields:
  - format: string
  - codec: string
  - width: number
  - height: number
  - fps: number
- 규칙: width/height는 positive

## Storage Value Objects

### StoragePath
- type: string
- 규칙: non-empty

### FileKey
- type: string
- 규칙: non-empty

## Synchronization Value Objects

### SyncSessionId
- type: string

### SyncStatus
- type: enum
- values: configured, synced, failed

## Configuration Value Objects

### ConfigKey
- type: string
- 규칙: non-empty

### ConfigValue
- type: string
