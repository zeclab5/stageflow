#!/usr/bin/env python3
"""SQLite schema initializer and seeder for StageFlow."""

from __future__ import annotations

import sqlite3
import sys
from pathlib import Path

SCHEMA = """
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
"""

SEEDS = [
    ("projects", "INSERT OR REPLACE INTO projects (id, name, status) VALUES (?, ?, ?)", [("p1", "stage show", "active")]),
    ("scenes", "INSERT OR REPLACE INTO scenes (id, project_id, name, \"order\") VALUES (?, ?, ?, ?)", [("s1", "p1", "opening", 1)]),
    ("prompts", "INSERT OR REPLACE INTO prompts (id, project_id, template, variables, version) VALUES (?, ?, ?, ?, ?)", [("pr1", "p1", "scene: {name}", "{}", 1)]),
    ("assets", "INSERT OR REPLACE INTO assets (id, project_id, type, uri) VALUES (?, ?, ?, ?)", [("a1", "p1", "image", "s3://a.jpg")]),
    ("generations", "INSERT OR REPLACE INTO generations (id, project_id, scene_id, prompt_id, provider, params, status) VALUES (?, ?, ?, ?, ?, ?, ?)", [("g1", "p1", "s1", "pr1", "dummy", "{}", "requested")]),
    ("integrations", "INSERT OR REPLACE INTO integrations (id, name, type, config, status) VALUES (?, ?, ?, ?, ?)", [("i1", "Resolume", "resolume", "{}", "connected")]),
]


def ensure_path(path: str) -> Path:
  p = Path(path)
  if p.exists() and p.is_dir():
    raise SystemExit(f"refusing to overwrite directory: {path}")
  p.parent.mkdir(parents=True, exist_ok=True)
  return p


def init_db(path: str, seed: bool = False) -> None:
  db_path = ensure_path(path)
  conn = sqlite3.connect(db_path)
  try:
    conn.executescript(SCHEMA)
    conn.commit()
    if seed:
      for table, sql, rows in SEEDS:
        conn.executemany(sql, rows)
      conn.commit()
  finally:
    conn.close()


def main() -> int:
  args = sys.argv[1:]
  if not args or args[0] in {"--help", "-h"}:
    print("usage: init_sqlite.py <db.sqlite> [--seed]")
    return 0
  path = args[0]
  seed = "--seed" in args
  init_db(path, seed=seed)
  return 0


if __name__ == "__main__":
  raise SystemExit(main())
