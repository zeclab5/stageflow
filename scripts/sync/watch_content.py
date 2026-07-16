#!/usr/bin/env python3
"""Watch public/content and emit structured sync change events."""

from __future__ import annotations

import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from sync_public import ensure_structure, scan_meta_dirs, validate_meta_shapes, write_report

REPORT_PATH = Path(".stageflow-sync-report.json")
BASE = Path("public")
ALLOWED_BASES = {
  "works": BASE / "content" / "works",
  "blog": BASE / "content" / "blog",
}


SectionEntry = dict[str, object]
Snapshot = dict[str, dict[str, SectionEntry]]


def _snapshot() -> Snapshot:
  ensure_structure()
  return {
    "works": scan_meta_dirs(ALLOWED_BASES["works"]),
    "blog": scan_meta_dirs(ALLOWED_BASES["blog"]),
  }


def _diff(prev: Snapshot, curr: Snapshot) -> list[dict[str, object]]:
  events: list[dict[str, object]] = []
  all_slugs = set(prev.get("works", {})) | set(curr.get("works", {})) | set(prev.get("blog", {})) | set(curr.get("blog", {}))
  for slug in sorted(all_slugs):
    for section in ("works", "blog"):
      key = f"{section}:{slug}"
      before = prev.get(section, {}).get(slug)
      after = curr.get(section, {}).get(slug)
      if before is None and after is not None:
        events.append({"type": "created", "key": key, "after": after})
      elif before is not None and after is None:
        events.append({"type": "removed", "key": key, "before": before})
      elif before != after:
        events.append({"type": "updated", "key": key, "before": before, "after": after})
  return events


def on_change(prev: Snapshot | None = None) -> tuple[dict[str, object], list[dict[str, object]]]:
  curr = _snapshot()
  issues = validate_meta_shapes({"works": curr.get("works", {}), "blog": curr.get("blog", {})})
  events = [] if prev is None else _diff(prev, curr)
  result = {
    "works_count": len(curr.get("works", {})),
    "blog_count": len(curr.get("blog", {})),
    "issues_count": len(issues),
    "issues": issues,
    "events": events,
  }
  write_report(result, REPORT_PATH)
  result["report"] = str(REPORT_PATH)
  return result, events


def watch(poll_interval: int = 2) -> None:
  if not BASE.exists():
    raise SystemExit("public directory not found")
  prev = _snapshot()
  result, _ = on_change(prev)
  print(json.dumps(result, ensure_ascii=False, indent=2))
  while True:
    time.sleep(poll_interval)
    prev, events = on_change(prev)
    if events:
      print(json.dumps({"changed": True, **prev}, ensure_ascii=False, indent=2))


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
  if args[0] == "sync":
    result, _ = on_change()
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0
  raise SystemExit("unknown command")


if __name__ == "__main__":
  raise SystemExit(main())
