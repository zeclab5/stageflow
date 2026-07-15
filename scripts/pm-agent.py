#!/usr/bin/env python3
"""StageFlow Project Manager Agent"""

import subprocess
import json
import sys

WORKDIR = "/Users/jangjaeho/zeclab/StageFlow"

TASKS = [
    "npm run build",
    "npm run lint",
    "npm test",
    "git add .",
    "git commit -m 'chore: update current state and API routing'",
    "git push origin main"
]

def run():
    for task in TASKS:
        print(f"[PM] Running: {task}")
        result = subprocess.run(task, shell=True, cwd=WORKDIR, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"[PM] FAILED: {task}")
            print(result.stdout)
            print(result.stderr)
            sys.exit(1)
        print(f"[PM] OK: {task}")
    print("[PM] All tasks completed successfully.")

if __name__ == "__main__":
    run()
