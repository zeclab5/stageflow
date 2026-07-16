---
Title: PRODUCT_REQUIREMENTS
Version: 1.0
Status: Review
Author: Hermes
Reviewer: ChatGPT (CTO)
Created: 2026-07-16
Updated: 2026-07-16
Category: product
Tags: [prd, requirements]
---

# PRODUCT_REQUIREMENTS

## Overview
StageFlow의 기능·비기능 요구사항을 정의한다.

## Purpose
개발자가 PRD만 보고 구현 방향을 이해할 수 있는 수준으로 기술한다.

## Scope
- 프로젝트/장면/자산/프롬프트/생성 작업
- API 인증/플러그인/콘텐츠 자동 반영

## Goals
- 기능 요구사항 명세
- 비기능 요구사항 명세
- 성공 기준 정의

## Non-goals
- 특정 장비 모든 기능 대체
- 오프라인 독립 실행 에디터

## Users
- 공연 연출가
- 미디어 아티스트
- 조명/사운드 감독
- 공연 기획자

## Requirements
- 프로젝트 CRUD 및 상태 흐름
- 장면/자산/프롬프트/생성 작업 관리
- x-api-key 인증 및 Authorization Bearer
- content scan → meta 기반 자동 웹 콘텐츠 반영
- 플러그인 manifest/loaded 관리

## Success Metrics
- 로컬 개발 환경에서 300~400ms 응답
- 빌드/린트/테스트 단일 명령 통과
- Vercel preview/production 배포 가능
- content sync 반영 1분 이내

## Dependencies
- Node.js 20+
- SQLite
- Vercel

## Related Documents
- docs/product/PRODUCT_VISION.md
- docs/product/CORE_FEATURES.md
- specs/SPEC-000.md

## Revision History
- 2026-07-16: 1.0 초기 작성
