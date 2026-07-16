#!/usr/bin/env python3
"""Sync public/content meta changes and validate structure."""

from __future__ import annotations

import json
import sys
from pathlib import Path

PUBLIC = Path("public")
ALLOWED_DIRS = {"works", "blog"}
REPORT_DEFAULT = Path(".stageflow-sync-report.json")


def ensure_structure() -> list[Path]:
  missing: list[Path] = []
  for name in ALLOWED_DIRS:
    target = PUBLIC / "content" / name
    target.mkdir(parents=True, exist_ok=True)
    if not target.exists():
      missing.append(target)
  return missing


def scan_meta_dirs(base: Path) -> dict[str, dict[str, object]]:
  result: dict[str, dict[str, object]] = {}
  if not base.exists():
    return result
  for child in sorted(base.iterdir()):
    if not child.is_dir():
      continue
    meta_path = child / "meta.json"
    if not meta_path.exists():
      continue
    try:
      data = json.loads(meta_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
      data = {"error": "invalid_json", "path": str(meta_path)}
    result[child.name] = data
  return result


def validate_meta_shapes(data: dict[str, object]) -> list[dict[str, object]]:
  issues: list[dict[str, object]] = []
  for slug, payload in data.items():
    if not isinstance(payload, dict):
      issues.append({"slug": slug, "issue": "meta_root_not_object"})
      continue
    if "slug" not in payload:
      payload["slug"] = slug  # type: ignore[index, assignment]
  return issues


def write_report(result: dict[str, object], path: Path = REPORT_DEFAULT) -> Path:
  path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
  return path


def synchronize(report: bool = True, report_path: Path = REPORT_DEFAULT) -> dict[str, object]:
  ensure_structure()
  works = scan_meta_dirs(PUBLIC / "content" / "works")
  blog = scan_meta_dirs(PUBLIC / "content" / "blog")
  issues = validate_meta_shapes({"works": works, "blog": blog})
  result = {
    "works_count": len(works),
    "blog_count": len(blog),
    "issues_count": len(issues),
    "issues": issues,
  }
  if report:
    write_report(result, report_path)
    result["report"] = str(report_path)
  return result


def main() -> int:
  args = sys.argv[1:]
  if not args or args[0] in {"--help", "-h"}:
    print("usage: sync_public.py [--no-report] [--report-path=...]")
    return 0
  report = "--no-report" not in args
  report_path = REPORT_DEFAULT
  for arg in args:
    if arg.startswith("--report-path="):
      report_path = Path(arg.split("=", 1)[1])
  result = synchronize(report=report, report_path=report_path)
  print(json.dumps(result, ensure_ascii=False, indent=2))
  return 0


if __name__ == "__main__":
  raise SystemExit(main())
