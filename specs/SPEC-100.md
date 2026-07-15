# SPEC-100 : Product

Version: 0.1
Status: Approved
Date: 2026-07-15

---

# 목표

StageFlow의 제품 기능 범위, 사용자 흐름, 경계를 정의한다.

---

# 제품 범위 (MVP)

1. Project Management
2. Scene Management
3. Prompt Management
4. Asset Management
5. AI Generation
6. Resolume Integration

---

# 기능 명세

## Project Management

- 프로젝트 생성, 수정, 삭제
- 프로젝트 상태 관리
- 메타데이터 관리

## Scene Management

- 씬 생성, 수정, 삭제
- 씬 순서 관리
- 시간라인 / 트리거 관리

## Prompt Management

- 프롬프트 생성, 수정, 삭제
- 프롬프트 버전 관리
- 변수화된 프롬프트 템플릿

## Asset Management

- 이미지, 영상, 오디오, 텍스트 등록
- 태그 / 메타정보 관리
- 사용 이력 추적

## AI Generation

- 텍스트 to image
- 텍스트 to audio
- 스타일 변환 / 보간
- AI Provider 독립적 구조

## Resolume Integration

- Resolume 연동은 Plugin으로만 처리
- 재생 제어
- 프리셷 동기화

---

# 사용자 역할

- Founder : 최종 의사결정
- CTO : 아키텍처 / Specification / Review
- Lead Developer : Implementation / Refactoring / Testing
- Automation / Agent / Tool / Local Workflow

---

# 제약

- 기존 프로그램을 대체하는 것이 아니다.
- 연결(Integration)이 핵심이다.
- 외부 프로그램은 Plugin으로만 연결한다.

---

# 변경 이력

2026-07-15 : 초기 생성
