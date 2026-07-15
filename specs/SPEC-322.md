# SPEC-322 : Prompt Aggregate Implementation

Version: 0.1
Status: Approved
Date: 2026-07-15

---

# 목표

Prompt Aggregate의 구현 계약을 정의한다.

---

# 경계

- Aggregate Root: Prompt
- Value Object: PromptTemplate, PromptVariableMap
- Entity: 없음

---

# 명령

- CreatePrompt(projectId, template, variables?)
- UpdatePromptTemplate(id, template)
- UpdatePromptVariables(id, variables)

---

# 조회

- GetPrompt(id)
- ListPrompts(projectId)

---

# 이벤트

- PromptCreated
- PromptTemplateUpdated
- PromptVariablesUpdated
- PromptVersionBumped

---

# 규칙

- template은 비어 있을 수 없다.
- variables는 key-value 문자열 맵.
- 변경 시 version 증가.

---

# 패키지 구조

packages/core/src/domain/prompt/
- PromptTemplate.ts
- PromptVariableMap.ts
- PromptRepository.ts

packages/core/src/application/
- command/PromptCommand.ts
- query/PromptQuery.ts

packages/core/src/infrastructure/repository/
- InMemoryPromptRepository.ts
