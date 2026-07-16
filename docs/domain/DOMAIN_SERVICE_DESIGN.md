---
Title: DOMAIN_SERVICE_DESIGN
Version: 1.0
Status: Review
Author: Hermes
Reviewer: ChatGPT (CTO)
Created: 2026-07-16
Updated: 2026-07-16
Category: domain
Tags: [domain-service, domain]
---

# DOMAIN_SERVICE_DESIGN

> Domain Service는 Aggregate Root에 속하지 않는 도메인 로직을 담당한다.
> 여러 Aggregate가 필요한 계산/규칙을 적용할 때 사용한다.
> Application Service와 혼동하지 않는다.

## Characteristics
- stateless
- 여러 Aggregate 참조 가능
- 도메인 이벤트 발행 가능
- 인프라 의존 금지

## Domain Service Rules
- Domain Service는 하나의 도메인 규칙만 책임진다.
- Domain Service는 Aggregate를 직접 변경하지 않고, Command를 통해 변경한다.
- Domain Service는 Repository를 직접 호출하지 않고, Application Service에서 호출한다.

## Domain Services

### ProjectService
- 책임: 프로젝트 생성/종료/상태 변경 오케스트레이션
- 사용 Aggregate: Project
- 관련 Command: CreateProject, CloseProject, UpdateProject
- 관련 Event: ProjectCreated, ProjectClosed, ProjectUpdated

### SceneService
- 책임: 장면 생성/이름 변경/순서 변경
- 사용 Aggregate: Scene
- 관련 Command: CreateScene, RenameScene, ReorderScene, RemoveScene
- 관련 Event: SceneCreated, SceneRenamed, SceneReordered, SceneRemoved

### CueService
- 책임: Cue 실행/완료/실패 처리
- 사용 Aggregate: Cue
- 관련 Command: TriggerCue, CompleteCue, FailCue
- 관련 Event: CueTriggered, CueDone, CueFailed

### PlaybackService
- 책임: 재생 시작/중지/완료 처리
- 사용 Aggregate: Playback
- 관련 Command: StartPlayback, StopPlayback, FinishPlayback
- 관련 Event: PlaybackStarted, PlaybackFinished, PlaybackStopped

### AssetService
- 책임: 자산 등록/회수/메타 변경
- 사용 Aggregate: Asset
- 관련 Command: RegisterAsset, RetireAsset, UpdateAssetMeta
- 관련 Event: AssetRegistered, AssetRetired, AssetUpdated

### OutputService
- 책임: 출력 생성/비활성/라우팅
- 사용 Aggregate: Output
- 관련 Command: CreateOutput, DisableOutput, RouteOutput
- 관련 Event: OutputCreated, OutputDisabled, OutputRouted

### PluginService
- 책임: 플러그인 등록/로드/비활성
- 사용 Aggregate: Plugin
- 관련 Command: RegisterPlugin, LoadPlugin, DisablePlugin
- 관련 Event: PluginRegistered, PluginLoaded, PluginDisabled

### WorkspaceService
- 책임: 워크스페이스 생성/보관
- 사용 Aggregate: Workspace
- 관련 Command: CreateWorkspace, ArchiveWorkspace
- 관련 Event: WorkspaceCreated, WorkspaceArchived

### PromptService
- 책임: 프롬프트 생성/템플릿 수정
- 사용 Aggregate: Prompt
- 관련 Command: CreatePrompt, UpdatePromptTemplate
- 관련 Event: PromptCreated, PromptUpdated

### AIAgentService
- 책임: 에이전트 시작/중지/상태 조회
- 사용 Aggregate: AIAgent
- 관련 Command: StartAgent, StopAgent
- 관련 Event: AgentStarted, AgentStopped

### AIWorkflowService
- 책임: 워크플로 실행/재시도/상태 조회
- 사용 Aggregate: Workflow
- 관련 Command: StartWorkflow, RetryWorkflow
- 관련 Event: WorkflowStarted, WorkflowCompleted, WorkflowFailed

### AIMemoryService
- 책임: 메모리 저장/검색/조회
- 사용 Aggregate: Memory
- 관련 Command: StoreMemory, SearchMemory
- 관련 Event: MemoryStored, MemoryRetrieved

### AuthService
- 책임: 인증/권한/토큰 발급
- 사용 Aggregate: Permission
- 관련 Command: Login, Logout, IssueToken
- 관련 Event: UserAuthenticated, UserAuthorized

### OrganizationService
- 책임: 조직 생성/멤버 추가/제거
- 사용 Aggregate: Organization
- 관련 Command: CreateOrganization, AddMember, RemoveMember
- 관련 Event: OrganizationCreated, MemberAdded, MemberRemoved

### StorageService
- 책임: 파일 업로드/삭제/URL 조회
- 사용 Aggregate: Storage
- 관련 Command: UploadFile, RemoveFile
- 관련 Event: FileUploaded, FileRemoved

### MediaService
- 책임: 포맷 변환/유효성 검사
- 사용 Aggregate: MediaSpec
- 관련 Command: ConvertMedia, ValidateMedia
- 관련 Event: MediaConverted, MediaValidated

### SynchronizationService
- 책임: 동기화 시작/중지/상태 조회
- 사용 Aggregate: SyncSession
- 관련 Command: StartSync, StopSync
- 관련 Event: SyncStarted, SyncCompleted, SyncFailed

### ConfigurationService
- 책임: 설정 변경/롤백/히스토리
- 사용 Aggregate: Config
- 관련 Command: UpdateConfig, RollbackConfig
- 관련 Event: ConfigUpdated, ConfigRolledBack

## Domain Service Invariants
- Domain Service는 단일 책임을 가진다.
- Domain Service는 인프라 의존을 가지지 않는다.
- Domain Service는 트랜잭션/타임아웃을 직접 제어하지 않는다.

## Domain Service Relationship
각 Domain Service는 최소 1개의 Aggregate Root에 연결된다.
Application Service 또는 API Route에서 호출한다.
