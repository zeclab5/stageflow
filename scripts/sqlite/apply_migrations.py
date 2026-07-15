#!/usr/bin/env python3
"""Apply ordered SQLite migration files to a database."""

from __future__ import annotations

import sqlite3
import sys
from pathlib import Path

MIGRATIONS_DIR = Path(__file__).with_name("migrations")


def ensure_migrations_table(conn: sqlite3.Connection) -> None:
  conn.execute(
    """
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
    """
  )
  conn.commit()


def applied_versions(conn: sqlite3.Connection) -> set[str]:
  rows = conn.execute("SELECT version FROM schema_migrations").fetchall()
  return {row[0] for row in rows}


def migration_files() -> list[Path]:
  if not MIGRATIONS_DIR.exists():
    return []
  return sorted(MIGRATIONS_DIR.glob("V*.sql"))


def apply(db_path: str) -> None:
  db_file = Path(db_path)
  db_file.parent.mkdir(parents=True, exist_ok=True)
  conn = sqlite3.connect(db_file)
  try:
    ensure_migrations_table(conn)
    seen = applied_versions(conn)
    files = migration_files()
    applied = 0
    for migration in files:
      version = migration.stem
      if version in seen:
        continue
      sql = migration.read_text(encoding="utf-8")
      conn.executescript(sql)
      conn.execute("INSERT INTO schema_migrations (version) VALUES (?)", [version])
      conn.commit()
      applied += 1
    print(f"applied={applied} files={len(files)} db={db_path}")
  finally:
    conn.close()


def main() -> int:
  args = sys.argv[1:]
  if not args or args[0] in {"--help", "-h"}:
    print("usage: apply_migrations.py <db.sqlite>")
    return 0
  apply(args[0])
  return 0


if __name__ == "__main__":
  raise SystemExit(main())
