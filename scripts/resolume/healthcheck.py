#!/usr/bin/env python3
"""Check Resolume API health for given host/port."""

from __future__ import annotations

import argparse
import urllib.error
import urllib.request


def check(host: str, port: int, path: str = "/api/v1/composition/list_composition", timeout: int = 2) -> int:
  url = f"http://{host}:{port}{path}"
  try:
    with urllib.request.urlopen(url, timeout=timeout) as resp:
      print(f"status={resp.status} url={url}")
      return 0
  except urllib.error.URLError as err:
    print(f"failed={err.reason} url={url}")
    return 1


def main() -> int:
  parser = argparse.ArgumentParser(description="Resolume API health check")
  parser.add_argument("--host", default="127.0.0.1")
  parser.add_argument("--port", type=int, default=8080)
  args = parser.parse_args()
  return check(args.host, args.port)


if __name__ == "__main__":
  raise SystemExit(main())
