# SPEC-310 : Technology Stack

Version: 0.1
Status: Approved
Date: 2026-07-15

---

# 목표

MVP 개발에 사용할 기술 스택을 결정하고 구현 언어/런타임/도구를 고정한다.

---

# 원칙

- Architecture / DDD / Plugin First를 구현 가능한 생태계를 선택한다.
- AI Provider 독립성을 유지한다.
- 운영/배포 복잡도보다 확장성 우선.

---

# 결정

## Language / Runtime

- TypeScript 5.x
- Node.js 20+

## Library / Framework

- Command/Query: TypeScript class + interfaces
- DI/Module: 기존 프레임워크 없이 module boundary는 명시적 import로 유지
- Event Bus: in-memory bus stub (확장용)
- Persistence: 추후 결정, 현재는 repository 인터페이스만 고정

## Frontend

- 추후 별도 SPEC에서 결정. 현재 repository 내 준비 공간만 확보.

## AI

- 추상화 계층만 정의. Provider 구현체는 추후 plugin 모듈로 분리.

## Deployment

- GitHub Actions CI
- Docker 기반

---

# 금지

- 프레임워크 강제 도입 금지
- AI Provider 직접 코드 의존 금지

---

# 변경 이력

2026-07-15 : 초기 생성
