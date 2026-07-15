# SPEC-321 : Scene Aggregate Implementation

Version: 0.1
Status: Approved
Date: 2026-07-15

---

# 목표

Scene Aggregate의 구현 계약을 정의한다.

---

# 경계

- Aggregate Root: Scene
- Value Object: Timeline, Trigger
- Entity: 없음(scene 단일 root)

---

# 명령

- CreateScene(projectId, name, order)
- RenameScene(id, name)
- ReorderScene(id, order)

---

# 조회

- GetScene(id)
- ListScenes(projectId)

---

# 이벤트

- SceneCreated
- SceneRenamed
- SceneReordered

---

# 규칙

- name은 비어 있을 수 없다.
- order는 1 이상 정수.
- 같은 projectId 내에서의 충돌 검사는 인프라에서 처리.

---

# 패키지 구조

packages/core/src/domain/scene/
- Scene.ts
- SceneRepository.ts

packages/core/src/application/
- command/CreateScene.ts
- command/RenameScene.ts
- command/ReorderScene.ts
- query/GetScene.ts
- query/ListScenes.ts
