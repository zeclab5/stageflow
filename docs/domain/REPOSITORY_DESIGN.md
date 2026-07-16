---
Title: REPOSITORY_DESIGN
Version: 1.0
Status: Review
Author: Hermes
Reviewer: ChatGPT (CTO)
Created: 2026-07-16
Updated: 2026-07-16
Category: domain
Tags: [repository, domain]
---

# REPOSITORY_DESIGN

> Repository는 Aggregate 단위로 존재한다.
> Aggregate Root에 대한 저장/조회/삭제 책임을 가진다.
> Entity 단위 직접 접근은 금지한다.

## Repository Responsibilities
- Aggregate Root 단위 저장
- Aggregate Root 단위 조회
- Aggregate Root 단위 삭제
- Collection/Predicate 기반 목록 조회

## Repository Rule
- Aggregate마다 Repository는 하나만 존재한다.
- 저장소 기술 교체는 Repository에서만 변경한다.
- Application Service 또는 Domain Service에서만 사용한다.

## Repositories

### ProjectRepository
- methods: findById(id), save(project), delete(id), findAll(filter?)

### ShowRepository
- methods: findById(id), save(show), delete(id), findAll(filter?)

### SceneRepository
- methods: findById(id), save(scene), delete(id), findAll(filter?)

### TimelineRepository
- methods: findById(id), save(timeline), delete(id), findAll(filter?)

### CueRepository
- methods: findById(id), save(cue), delete(id), findAll(filter?)

### AssetRepository
- methods: findById(id), save(asset), delete(id), findAll(filter?)

### WorkspaceRepository
- methods: findById(id), save(workspace), delete(id), findAll(filter?)

### PluginRepository
- methods: findById(id), save(plugin), delete(id), findAll(filter?)

### PlaybackRepository
- methods: findById(id), save(playback), delete(id), findAll(filter?)

### OutputRepository
- methods: findById(id), save(output), delete(id), findAll(filter?)

### UserRepository
- methods: findById(id), save(user), delete(id), findAll(filter?)

### OrganizationRepository
- methods: findById(id), save(organization), delete(id), findAll(filter?)

## Implementation Note
- 현재 SQLite 기반 구현 존재.
- InMemoryRepository는 테스트용으로만 사용한다.
- Repository 인터페이스는 domain layer에 둔다.
