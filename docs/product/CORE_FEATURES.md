---
Title: CORE_FEATURES
Version: 1.0
Status: Review
Author: Hermes
Reviewer: ChatGPT (CTO)
Created: 2026-07-16
Updated: 2026-07-16
Category: product
Tags: [features, mvp]
---

# CORE_FEATURES

## Overview
MVP에서 반드시 구현해야 핵심 기능을 정의한다.

## Purpose
구현 범위를 명확히 하고 우선순위 기준을 제공한다.

## Scope
MVP 범위 내 기능

## Goals
- 필수 기능 목록 정리
- 구현 우선순위 정렬

## Non-goals
- 준비 세부 기능 구현

## Users
공연 연출가, 미디어 아티스트, 기술 감독, 공연 기획자

## Requirements
### Project Management
- 프로젝트 CRUD, 상태 흐름, 연동 관리
### Scene Management
- 장면 생성/정렬, sceneOrder
### Asset Management
- 자산 등록/조회, 썸네일/메타
### Timeline
- 장면 순서 관리, 실행 상태 추적
### Prompt System
- 프롬프트 버전, 자산/장면 연결
### AI Assistant
- 생성 작업 요청/조회, 상태/결과 추적
### Plugin System
- 플러그인 manifest/loaded 관리
### Resolume Connector
- REST 기반 연동 스텁, healthcheck
### Export / Import
- 콘텐츠 웹 반영, report 생성

## Success Metrics
- 각 기능이 API/Web에서 검증 가능
- web 테스트에서 사용자 화면 확인 가능

## Dependencies
- docs/product/PRODUCT_REQUIREMENTS.md
- specs/SPEC-000.md

## Related Documents
- docs/product/PRODUCT_ROADMAP.md
- specs/SPEC-000.md

## Revision History
- 2026-07-16: 1.0 초기 작성
