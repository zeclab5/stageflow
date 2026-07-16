---
Title: USER_PERSONAS
Version: 1.0
Status: Review
Author: Hermes
Reviewer: ChatGPT (CTO)
Created: 2026-07-16
Updated: 2026-07-16
Category: product
Tags: [personas, users]
---

# USER_PERSONAS

## Overview
StageFlow 핵심 사용자 그룹을 정의한다.

## Purpose
각 사용자의 목표·문제·사용 시나리오를 명확화해 요구사항 분석에 활용한다.

## Scope
- 공연 연출가
- 미디어 아티스트/프로젝션 매퍼
- 조명/사운드 기술 감독
- 공연 기획자/운영자

## Goals
- 목표
- 문제점
- 사용 시나리오

## Non-goals
- 모든 직군·직책 포함
- 실제 개인정보 기반 페르소나

## Users
### Persona 1: 공연 연출가
- 목표: 공연 전체 흐름과 메시지를 일관되게 관리
- 문제점: 장면/자산/타임라인이 흩어져 있고 수정이 반복됨
- 사용 시나리오: 프로젝트 단위로 장면 그룹을 만들고, 자산과 프롬프트를 연결해 재사용

### Persona 2: 미디어 아티스트/프로젝션 매퍼
- 목표: 영상/이미지 자산과 장면을 빠르게 연결
- 문제점: 파일 이름, 날짜, 버전 관리가 어려움
- 사용 시나리오: 자산 등록 후 장면에 매핑하고 생성 결과를 타임라인에 반영

### Persona 3: 조명/사운드 기술 감독
- 목표: 하드웨어/소프트웨어 연동을 일관 인터페이스로 관리
- 문제점: 장비마다 연동 방식이 달라 시간 소모가 큼
- 사용 시나리오: 플러그인으로 Resolume/Unreal을 표준 경로로 조회/제어

### Persona 4: 공연 기획자/운영자
- 목표: 일정, 담당자, 외부 파일을 프로젝트 안에 모으기
- 사용 시나리오: 프로젝트와 연동 프로필을 등록하고 운영 상태를 추적

## Requirements
- 사용자 정의 단계에서 활용 가능한 Persona 포맷
- Goals/Problems/Scenarios 필수 포함

## Success Metrics
- 핵심 사용자 4명 이상 커버
- 각 Persona별 시나리오 1개 이상 존재

## Dependencies
- docs/product/PRODUCT_VISION.md
- docs/product/USER_JOURNEY.md

## Related Documents
- docs/product/PRODUCT_VISION.md
- docs/product/USER_JOURNEY.md

## Revision History
- 2026-07-16: 1.0 초기 작성
