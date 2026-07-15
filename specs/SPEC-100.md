# SPEC-100 : Product

Version: 0.2
Status: Approved
Date: 2026-07-15

---

# 목표

StageFlow의 제품 기능 범위, 사용자 흐름, 경계를 정의한다. 구현 범위는 MVP로 제한한다.

---

# 제품 범위 (MVP)

1. Project Management
2. Scene Management
3. Prompt Management
4. Asset Management
5. AI Generation
6. Integration

---

# 기능 명세

## Project Management

- 프로젝트 생성, 조회, 수정, 종료
- 프로젝트 상태 관리
- 프로젝트 메타데이터 관리

## Scene Management

- 프로젝트별 씬 생성, 조회, 이름 변경, 순서 변경
- 씬은 프로젝트에 종속된다.

## Prompt Management

- 프로젝트별 프롬프트 생성, 조회, 템플릿 수정
- 프롬프트 템플릿과 버전 관리

## Asset Management

- 프로젝트별 에셋 등록, 조회, 회수
- 에셋 유형: image, video, audio, text

## AI Generation

- 제너레이션 잡 생성, 상태 변경, 출력 연결
- 제너레이션은 프로젝트/씬/프롬프트와 연결 가능
- 상태: requested, completed, failed

## Integration

- Integration 생성, 조회, 활성화, 정지
- 통합 프로필은 범용 외부 시스템 연결 지점이다.
- 모든 외부 프로그램은 Plugin으로 연결한다.

---

# 사용자 역할

- Founder: 최종 의사결정
- CTO: Architecture / Specification / Review
- Lead Developer: Implementation / Refactoring / Testing
- Automation / Agent / Tool / Local Workflow: 자동화 보조

---

# 제약

- 기존 프로그램을 대체하는 것이 아니다.
- 연결이 핵심이다.
- 외부 프로그램은 Plugin으로만 연결한다.
- AI 기능은 Provider 독립 구조로 구현한다.

---

# 변경 이력

2026-07-15 : 초기 생성
