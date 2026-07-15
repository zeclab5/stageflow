#!/usr/bin/env python3
"""Watch public/content and sync changes."""

from __future__ import annotations

import json
import sys
import time
from pathlib import Path
from typing import Callable

from sync_public import ensure_structure, scan_meta_dirs, validate_meta_shapes


def report_path() -> Path:
  return Path(".stageflow-sync-report.json")


def write_report(result: dict[str, object]) -> None:
  report_path().write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")


def on_change() -> dict[str, object]:
  ensure_structure()
  works = scan_meta_dirs(Path("public") / "content" / "works")
  blog = scan_meta_dirs(Path("public") / "content" / "blog")
  issues = validate_meta_shapes({"works": works, "blog": blog})
  result = {
    "works_count": len(works),
    "blog_count": len(blog),
    "issues_count": len(issues),
    "issues": issues,
  }
  write_report(result)
  return result


def watch(poll_interval: int = 2) -> None:
  base = Path("public")
  if not base.exists():
    raise SystemExit("public directory not found")

  snapshot = on_change()
  print(json.dumps(snapshot, ensure_ascii=False, indent=2))

  while True:
    time.sleep(poll_interval)
    current = on_change()
    if current != snapshot:
      snapshot = current
      print(json.dumps(current, ensure_ascii=False, indent=2))


def main() -> int:
  args = sys.argv[1:]
  if not args or args[0] in {"--help", "-h"}:
    print("usage: watch_content.py [watch] [--interval=2]")
    return 0
  if args[0] == "watch":
    interval = 2
    for arg in args[1:]:
      if arg.startswith("--interval="):
        interval = int(arg.split("=", 1)[1])
    watch(poll_interval=interval)
    return 0
  raise SystemExit("unknown command")


if __name__ == "__main__":
  raise SystemExit(main())
