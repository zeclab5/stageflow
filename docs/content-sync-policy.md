# Content Sync Policy

## Goals

- `public/content/works`와 `public/content/blog`를 진실 원천(SSOT)으로 유지한다.
- `meta.json` 변경 시 자동 검증/리포트를 생성한다.
- 기존 항목의 slug 충돌 시 신규 항목으로 별도 처리한다.

## Structure

public/content/
  works/<slug>/
    meta.json
    images/...
  blog/<slug>/
    meta.json

## Tools

- scanner: `scripts/sync/sync_public.py`
- watcher: `scripts/sync/watch_content.py`
- sqlite init: `scripts/sqlite/init_sqlite.py`
- sqlite migrate: `scripts/sqlite/apply_migrations.py`
- report: `.stageflow-sync-report.json`

## Automation

- trigger: file watch 또는 cron
- command: `python3 scripts/sync/watch_content.py watch --interval=2`

## Validation

- encoding: UTF-8
- works 필수 키: `slug`, `title`, `description`, `date`, `client`, `thumbnail`
- blog 필수 키: `slug`, `title`, `description`, `date`, `tags`
- invalid meta: `.stageflow-sync-report.json`에 기록
- overwrite 금지: 동일 slug 발견 시 이슈로 기록

## Rollout

1. 사용자가 `public/content/<type>/<slug>/meta.json` 추가/변경
2. watcher/scanner가 변경 감지 및 검증
3. 리포트 생성
4. 필요 시 API/web에 반영
