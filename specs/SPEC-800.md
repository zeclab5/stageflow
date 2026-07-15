# SPEC-800 : Deployment

Version: 0.1
Status: Approved
Date: 2026-07-15

---

# 목표

StageFlow의 배포 단위, 환경 구성, 운영 정책을 정의한다.

---

# 원칙

- 모든 외부 시스템은 Plugin으로만 연결한다.
- 환경별 설정은 Config로 분리한다.

---

# 환경

- local
- staging
- production

---

# 배포 단위

- core service
- plugin modules
- web app
- worker

---

# 운영 정책

- 배포는 rolling 또는 blue/green.
- Secret은 외부 저장소에 두고 런타임 주입.
- 로그는 구조화된 포맷으로 수집.

---

# 변경 이력

2026-07-15 : 초기 생성
