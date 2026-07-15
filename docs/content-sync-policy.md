# Content Sync Policy

## Goals

- `public/content/works`와 `public/content/blog`를 진실 원천(SSOT)으로 유지한다.
- `lib/data.ts`, `lib/blog.ts` 산출물은 파생본으로 취급한다.
- 사용자가 새 프로젝트 폴더/사진을 넣으면 자동으로 스캔/정합성 검증을 거쳐 사이트에 반영한다.

## Structure

public/content/
  works/<slug>/
    meta.json
    images/...
  blog/<slug>/
    meta.json

## Automation

- scanner: `scripts/sync/sync_public.py`
- seeder: `scripts/sqlite/init_sqlite.py --seed /tmp/stageflow-api.sqlite`
- trigger: watch/folder event 또는 cron
- output: `.stageflow-sync-report.json`

## Policy

- `meta.json` encoding: UTF-8
- `meta.json` 필수 키:
  - works: `slug`, `title`, `description`, `date`, `client`, `thumbnail`
  - blog: `slug`, `title`, `description`, `date`, `tags`
- 이미지: WebP/JPEG, 경로 public/content/... 기준 상대경로
- 유효하지 않은 `meta.json`은 `issues` 리포트에 기록하고 이동하지 않는다.
- 덮어쓰기 금지: 기존 항목의 `slug` 충돌 시 신규 항목으로 별도 처리한다.
