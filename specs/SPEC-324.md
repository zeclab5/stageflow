# SPEC-324 : Generation Aggregate Implementation

Version: 0.1
Status: Approved
Date: 2026-07-15

---

# 목표

Generation Aggregate의 구현 계약을 정의한다.

---

# 경계

- Aggregate Root: GenerationJob
- Value Object: GenerationStatus, GenerationOutput
- Entity: 없음

---

# 명령

- CreateGenerationJob(projectId, sceneId?, promptId?, provider, params)
- UpdateGenerationStatus(id, status)
- AttachOutput(id, outputUri, metadata?)

---

# 조회

- GetGeneration(id)
- ListGenerations(projectId, sceneId?)

---

# 이벤트

- GenerationJobCreated
- GenerationStatusUpdated
- GenerationOutputAttached

---

# 규칙

- provider는 필수.
- status는 pending | processing | completed | failed.
- completed 상태에서는 생성 파라미터를 변경할 수 없다.
- 하나의 Job에는 하나의 Output만 연결한다.

---

# 패키지 구조

packages/core/src/domain/generation/
- GenerationStatus.ts
- GenerationOutput.ts
- GenerationJobRepository.ts

packages/core/src/application/
- command/GenerationCommand.ts
- query/GenerationQuery.ts

packages/core/src/infrastructure/repository/
- InMemoryGenerationJobRepository.ts
