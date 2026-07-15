# SPEC-320 : Project Aggregate Implementation

Version: 0.1
Status: Approved
Date: 2026-07-15

---

# 목표

Project Aggregate의 구현 계약, 명령/조회, 이벤트, Repository 규칙을 정의한다.

---

# 경계

- Aggregate Root: Project
- Value Object: ProjectMetadata, ProjectStatus
- Entity: 없음(project 단일 root)

---

# 명령 계약

- CreateProject(name: string)
- UpdateProject(id: string, patch: { name?: string })
- CloseProject(id: string)

---

# 조회 계약

- GetProject(id: string)
- ListProjects(filter?: { status?: string; nameContains?: string })

---

# 이벤트

- ProjectCreated
- ProjectUpdated
- ProjectClosed

---

# Repository 계약

- save(project)
- findById(id)
- existsById(id)

---

# 규칙

- name은 비어 있을 수 없다.
- 상태 전환은 draft -> active -> closed만 허용.
- closed 프로젝트는 수정할 수 없다.
- delete는 허용하지 않는다(Soft Delete 정책 회피).

---

# 패키지 구조

packages/core/src/domain/project/
- Project.ts
- ProjectStatus.ts
- ProjectEvent.ts
- ProjectRepository.ts

packages/core/src/application/
- command/CreateProject.ts
- command/UpdateProject.ts
- command/CloseProject.ts
- query/GetProject.ts
- query/ListProjects.ts

---

# 변경 이력

2026-07-15 : 초기 생성
