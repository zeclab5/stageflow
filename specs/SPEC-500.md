# SPEC-500 : API

Version: 0.1
Status: Approved
Date: 2026-07-15

---

# 목표

StageFlow API의 경로, 요청/응답, 에러 코드, 인증/권한 방식을 정의한다.

---

# Base

- protocol: HTTP/1.1
- host: API 서버
- prefix: `/api`
- auth: 미정 (MVP: API Key 또는 Bearer)
- error envelope: `{ "error": string }`

---

# Projects

GET /api/projects
- 200: `Project[]`
- 필터: `status`

POST /api/projects
- 201: `Project`
- body: `{ name: string, status?: string }`

GET /api/projects/:id
- 200: `Project`
- 404: not found

PATCH /api/projects/:id
- 200: `Project`
- body: `{ name?: string, status?: string }`

DELETE /api/projects/:id
- 204: no content
- 404: not found

---

# Scenes

GET /api/scenes?projectId=:projectId
- 200: `Scene[]`

POST /api/scenes
- 201: `Scene`
- body: `{ projectId: string, name: string, order: number }`

GET /api/scenes/:id
- 200: `Scene`
- 404: not found

PATCH /api/scenes/:id
- 200: `Scene`
- body: `{ name?: string, order?: number }`

DELETE /api/scenes/:id
- 204: no content
- 404: not found

---

# Prompts

GET /api/prompts?projectId=:projectId
- 200: `Prompt[]`

POST /api/prompts
- 201: `Prompt`
- body: `{ projectId: string, template: string, variables?: Record<string, string>, version?: number }`

GET /api/prompts/:id
- 200: `Prompt`
- 404: not found

PATCH /api/prompts/:id
- 200: `Prompt`
- body: `{ template?: string, variables?: Record<string, string>, version?: number }`

DELETE /api/prompts/:id
- 204: no content
- 404: not found

---

# Assets

GET /api/assets?projectId=:projectId&type=:type
- 200: `Asset[]`

POST /api/assets
- 201: `Asset`
- body: `{ projectId: string, type: 'image'|'video'|'audio'|'text', uri: string }`

GET /api/assets/:id
- 200: `Asset`
- 404: not found

PATCH /api/assets/:id
- 200: `Asset`
- body: `{ type?: 'image'|'video'|'audio'|'text', uri?: string }`

DELETE /api/assets/:id
- 204: no content
- 404: not found

---

# Generations

GET /api/generations?projectId=:projectId&sceneId=:sceneId&status=:status
- 200: `GenerationJob[]`

POST /api/generations
- 201: `GenerationJob`
- body: `{ projectId: string, sceneId?: string, promptId?: string, providerRef: string, params?: Record<string, unknown> }`

GET /api/generations/:id
- 200: `GenerationJob`
- 404: not found

PATCH /api/generations/:id
- 200: `GenerationJob`
- body: `{ status?: string, outputUri?: string }`

DELETE /api/generations/:id
- 204: no content
- 404: not found

---

# Integrations

GET /api/integrations
- 200: `IntegrationProfile[]`

POST /api/integrations
- 201: `IntegrationProfile`
- body: `{ name: string, type: string, config?: Record<string, unknown>, status?: string }`

GET /api/integrations/:id
- 200: `IntegrationProfile`
- 404: not found

PATCH /api/integrations/:id
- 200: `IntegrationProfile`
- body: `{ config?: Record<string, unknown>, status?: string }`

DELETE /api/integrations/:id
- 204: no content
- 404: not found

---

# Plugins

GET /api/plugins
- 200: `{ loaded: PluginRef[], manifests: PluginManifest[] }`

POST /api/plugins/:name/activate
- 201: `{ name: string }`
- body: `{ config?: Record<string, unknown> }`
- 400: activation failed

---

# 구현 상태

- 기본 CRUD 라우트 구현 완료
- PATCH는 partial update로 처리
- PATCH/DELETE는 존재하지 않는 리소스 404 반환
- 전역 에러 핸들러로 app crash 방지

---

# 변경 이력

2026-07-15 : 초기 생성
