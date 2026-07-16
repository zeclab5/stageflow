---
Title: PRODUCT_VISION
Version: 1.0
Status: Approved
Author: Hermes
Reviewer: ChatGPT (CTO)
Created: 2026-07-16
Updated: 2026-07-16
Category: product
Tags: [vision, mission, product]
---

# PRODUCT_VISION

## Overview
StageFlow는 공연 제작 현장의 운영 데이터를 구조화하고 반복 작업을 자동화하는 플랫폼이다.

## Purpose
공연/라이브 제작 현장에 흩어진 도구와 데이터를 하나의 워크플로우로 통합한다.

## Scope
- 공연 제작 프로젝트/장면/자산/프롬프트 관리
- AI 생성 작업 추적
- 외부 장비 연동 플러그인
- 콘텐츠 웹 사이트

## Goals
- Architecture First, Spec First, DDD
- Plugin First, API First, AI Provider Independent
- 로컬 개발에서 빌드/린트/테스트 통과
- Vercel 배포 가능

## Non-goals
- 특정 장비 벤더 기능 대체 툴
- 시각 편집기 중심 일반 창작 툴
- 오프라인 전용 독립 실행 에디터

## Users
- 공연 연출가
- 미디어 아티스트/프로젝션 매퍼
- 조명/사운드 기술 감독
- 공연 기획자/운영자

## Requirements
- API 인증
- SQLite persistence
- Web routes
- Plugin registry
- Content sync

## Success Metrics
- 빌드/린트/테스트 통과
- Vercel preview/production 배포 가능
- content sync로 meta 변경 자동 반영

## Dependencies
- Node.js
- TypeScript
- Express
- Vercel

## Related Documents
- docs/product/PRODUCT_REQUIREMENTS.md
- docs/product/CORE_FEATURES.md
- specs/SPEC-000.md

## Revision History
- 2026-07-16: 1.0 초기 작성
