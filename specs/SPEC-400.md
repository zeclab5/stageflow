# SPEC-400 : Database

Version: 0.1
Status: Approved
Date: 2026-07-15

---

# 목표

StageFlow의 데이터 영속화 전략과 SQLite 기반 스키마, 리포지토리 규칙을 정의한다.

---

# Database

- engine: sqlite3
- implementation: SQLiteConnection via `src/infrastructure/persistence/sqlite/SQLiteConnection.ts`
- schema bootstrap: `initializeDatabase()` in `src/infrastructure/persistence/sqlite/SQLiteProvider.ts`
- default path: `/tmp/stageflow-api.sqlite`

---

# Entity Relationship

- Project 1 - N Scene
- Project 1 - N Prompt
- Project 1 - N Asset
- Project 1 - N GenerationJob
- Integration standalone

---

# Schema

```sql
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
);

CREATE TABLE IF NOT EXISTS scenes (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  name TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS prompts (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  template TEXT NOT NULL,
  variables TEXT NOT NULL DEFAULT '{}',
  version INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  type TEXT NOT NULL,
  uri TEXT NOT NULL,
  metadata TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS generations (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  scene_id TEXT,
  prompt_id TEXT,
  provider TEXT NOT NULL,
  params TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending',
  output TEXT
);

CREATE TABLE IF NOT EXISTS integrations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  config TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft'
);
```

---

# Repository Policy

- 모든 Repository는 Application 레이어에서만 사용한다.
- Domain Model의 속성과 SQL 컬럼명이 다른 경우, Repository에서 매핑한다.
- 직접 SQL 문자열은 SQLiteProvider/Repository 내부에 제한한다.
- 외부 시스템 접근은 허용하지 않는다.

---

# 변경 이력

2026-07-15 : 초기 생성
