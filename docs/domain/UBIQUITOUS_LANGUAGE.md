# UBIQUITOUS_LANGUAGE

## Core Domain

### Project
Definition: 공연 제작의 최상위 단위.
Purpose: 예산/일정/담당자/연동 프로필을 묶는 컨테이너.
Example: "2026 공연", "월간 미디어 쇼".
Related Domains: Show, Scene, Asset, Prompt, GenerationJob, IntegrationProfile.
Lifecycle: draft -> active -> closed.
Owner: 공연 기획자/운영자.
Future Expansion: 사용자/권한/조직 연동.

### Show
Definition: Project 내에서 실제 무대에 서는 단위 공연.
Purpose: 공연 회차/버전을 관리.
Example: "1회", "리허설 A".
Related Domains: Project, Scene, Cue.
Lifecycle: planned -> ready -> performed -> archived.
Owner: 연출가.
Future Expansion: 공연장/공연일시 연동.

### Scene
Definition: 공연 시간 흐름 상의 장면 단위.
Purpose: 자산/프롬프트/생성 작업을 묶는 단위.
Example: "오프닝", "엔딩".
Related Domains: Project, Cue, Asset.
Lifecycle: planned -> ready -> performed.
Owner: 연출가/미디어 아티스트.
Future Expansion: 타임라인 실행 연동.

### Timeline
Definition: Scene/Cue의 실행 순서와 구간.
Purpose: 공연 실행 타이밍과 연결.
Example: "00:00-02:30 오프닝".
Related Domains: Scene, Cue, Transition.
Lifecycle: draft -> published -> executed.
Owner: 기술 감독.
Future Expansion: 정확한 동기화/싱크.

### Cue
Definition: Timeline 상에서 실행되는 최소 작업 단위.
Purpose: 조명/영상/사운드/미디어 등 실행 지점.
Example: "QLAB 1번", "Resolume Layer 2".
Related Domains: Scene, Timeline, Action.
Lifecycle: pending -> triggered -> done.
Owner: 기술 감독.
Future Expansion: 컨트롤러/자동 실행.

### Asset
Definition: Scene 등에 사용되는 미디어 자산.
Purpose: 이미지/영상/오디오/텍스트 자산 관리.
Example: "opening.mp4", "logo.png".
Related Domains: Project, Scene, Media.
Lifecycle: registered -> active -> retired.
Owner: 미디어 아티스트.
Future Expansion: 썸네일/메타/버전.

### Media
Definition: Asset의 구체 미디어 타입.
Purpose: image/video/audio/text 분류.
Example: image, video.
Related Domains: Asset.
Lifecycle: asset과 동일.
Owner: 미디어 아티스트.
Future Expansion: 자동 포맷 변환.

### Screen
Definition: 공연에서 사용되는 출력 화면 단위.
Purpose: 프로젝션/모니터/스크린 단위.
Example: "메인 스크린", "LED 월".
Related Domains: Output, Mapping.
Lifecycle: planned -> active -> decommissioned.
Owner: 기술 감독.
Future Expansion: 해상도/비율/보정.

### Display
Definition: 화면을 구성하는 논리적 출력.
Purpose: Screen을 논리적으로 묶는 단위.
Example: "좌우 2분할 디스플레이".
Related Domains: Screen, Mapping.
Lifecycle: planned -> active -> archived.
Owner: 기술 감독.
Future Expansion: 레이아웃/비율.

### Projector
Definition: 물리적 프로젝터/출력 장치.
Purpose: 실제 출력 장치 연결.
Example: "프로젝터 A(1080p)".
Related Domains: Screen, Output, Calibration.
Lifecycle: installed -> active -> replaced.
Owner: 공연장 운영자.
Future Expansion: 장비 인벤토리.

### Output
Definition: 출력 대상 최종 단위.
Purpose: 연동/매핑 결과가 실제 나가는 대상.
Example: "오프닝 출력", "보조 출력".
Related Domains: Screen, Projector, Cue.
Lifecycle: planned -> active -> disabled.
Owner: 기술 감독.
Future Expansion: 다중 출력 라우팅.

### Workspace
Definition: 사용자가 작업하는 환경 단위.
Purpose: 에셋/프롬프트/플러그인 설정을 묶는 단위.
Example: "2026 공연 워크스페이스".
Related Domains: Project, User, Plugin.
Lifecycle: created -> active -> archived.
Owner: 사용자.
Future Expansion: 팀/권한.

### Preset
Definition: 반복 사용 가능한 설정 묶음.
Purpose: Scene/Timeline/Cue 설정 재사용.
Example: "오프닝 프리셋".
Related Domains: Scene, Cue, Template.
Lifecycle: created -> active -> deprecated.
Owner: 기술 감독.
Future Expansion: 공유/마켓.

### Plugin
Definition: 외부 연동/기능을 격리한 모듈.
Purpose: 외부 시스템과 안전하게 연결.
Example: Resolume plugin, Unreal plugin.
Related Domains: IntegrationProfile, Workspace.
Lifecycle: registered -> loaded -> disabled.
Owner: 개발자/CTO.
Future Expansion: 플러그인 마켓.

### Prompt
Definition: AI 생성에 사용되는 텍스트 지시.
Purpose: 자산/장면과 연결되는 생성 지시어 관리.
Example: "오프닝 영상 생성 프롬프트".
Related Domains: Project, Scene, GenerationJob.
Lifecycle: created -> used -> archived.
Owner: 연출가/미디어 아티스트.
Future Expansion: 변수 매핑/템플릿.

### AI Agent
Definition: 자동화/생성을 지원하는 에이전트.
Purpose: 파이프라인 자동 실행/분석.
Example: content sync agent, generation agent.
Related Domains: Prompt, GenerationJob, Plugin.
Lifecycle: configured -> running -> stopped.
Owner: 개발자.
Future Expansion: 멀티 에이전트 오케스트레이션.

### Template
Definition: 재사용 가능한 프로젝트/장면/출력 구조.
Purpose: 반복 구조를 템플릿으로 저장.
Example: "공연 표준 템플릿".
Related Domains: Project, Scene, Preset.
Lifecycle: created -> active -> deprecated.
Owner: 연출가/기술 감독.
Future Expansion: 공유/버전.

### Library
Definition: 자산/프롬프트/템플릿 저장소.
Purpose: 재사용 가능한 항목을 모아둠.
Example: "회사 라이브러리".
Related Domains: Asset, Prompt, Template.
Lifecycle: created -> active -> archived.
Owner: 미디어 아티스트.
Future Expansion: 검색/태그.

### Render
Definition: 자산/출력물 생성 결과.
Purpose: 생성/인코딩 결과 관리.
Example: "opening_render.mp4".
Related Domains: GenerationJob, Asset.
Lifecycle: requested -> completed -> failed.
Owner: 미디어 아티스트.
Future Expansion: 품질/버전.

### Playback
Definition: 공연 실행 시 실제 재생 제어.
Purpose: 실행 중 출력/타이밍 제어.
Example: "Playback 1번".
Related Domains: Cue, Timeline, Output.
Lifecycle: ready -> playing -> finished.
Owner: 기술 감독.
Future Expansion: 싱크/리허설.

### Controller
Definition: 장비/시스템 제어 입력.
Purpose: 조명/영상/사운드 컨트롤 입력.
Example: "OSC Controller", "MIDI Fader".
Related Domains: Plugin, IntegrationProfile.
Lifecycle: registered -> active -> disabled.
Owner: 기술 감독.
Future Expansion: 매핑/프리셋.

### User
Definition: 시스템 사용자.
Purpose: 역할/권한과 연결.
Example: "감독 A", "아티스트 B".
Related Domains: Role, Permission, Organization.
Lifecycle: invited -> active -> disabled.
Owner: 운영자.
Future Expansion: SSO/초대.

### Role
Definition: 사용자 권한 집합.
Purpose: 기능 접근 제어.
Example: admin, operator, viewer.
Related Domains: User, Permission.
Lifecycle: created -> active -> deprecated.
Owner: CTO/운영자.
Future Expansion: 커스텀 역할.

### Permission
Definition: 기능 접근 권한 단위.
Purpose: 역할 기반 접근 제어.
Example: project:read, project:write.
Related Domains: Role, User.
Lifecycle: created -> active -> deprecated.
Owner: CTO/운영자.
Future Expansion: 리소스 기반 권한.

### Organization
Definition: 사용자/워크스페이스를 묶는 조직.
Purpose: 멀티 팀/멀티 프로젝트 관리.
Example: "zeclab".
Related Domains: User, Workspace.
Lifecycle: created -> active -> archived.
Owner: 운영자.
Future Expansion: 과금/팀.

### Stage
Definition: 공연이 이루어지는 공간.
Purpose: 공연장/설비 정보 관리.
Example: "홀 A", "블랙박스".
Related Domains: Show, Venue, Screen.
Lifecycle: planned -> active -> closed.
Owner: 공연장 운영자.
Future Expansion: 좌석/환경.

### Venue
Definition: 공연이 열리는 장소.
Purpose: 주소/설비/특이사항 관리.
Example: "서울 올림픽공원".
Related Domains: Stage, Performance.
Lifecycle: registered -> active -> deprecated.
Owner: 공연장 운영자.
Future Expansion: 예약/일정.

### Performance
Definition: 특정 날짜/회차의 공연 실행.
Purpose: 회차별 실행 기록.
Example: "2026-08-01 1회".
Related Domains: Show, Stage, Venue.
Lifecycle: scheduled -> performed -> archived.
Owner: 공연 기획자.
Future Expansion: 실행 로그/매출.

### Sequence
Definition: 공연 내 실행 순서 집합.
Purpose: Scene/Cue 실행 순서 명세.
Example: "오프닝 시퀀스".
Related Domains: Timeline, Scene, Cue.
Lifecycle: draft -> published -> executed.
Owner: 연출가.
Future Expansion: 자동 실행.

### Transition
Definition: 장면/출력 간 전환.
Purpose: Scene/Cue 간 전환 효과 정의.
Example: "크로스 디졸브", "컷".
Related Domains: Scene, Timeline, Cue.
Lifecycle: defined -> applied -> retired.
Owner: 미디어 아티스트.
Future Expansion: 자동 전환.

### Event
Definition: 시스템 내 중요한 상태 변화.
Purpose: 도메인 이벤트로 기록.
Example: ProjectCreated, ProjectClosed.
Related Domains: Action, DomainEvent.
Lifecycle: emitted -> handled -> stored.
Owner: 시스템 자동.
Future Expansion: 이벤트 소싱.

### Action
Definition: 사용자/시스템이 발생시킨 작업.
Purpose: 감사/추적.
Example: create project, close project.
Related Domains: Event, User.
Lifecycle: requested -> done -> failed.
Owner: 사용자/시스템.
Future Expansion: 롤백/보상.

### Camera
Definition: 공연 촬영 장비.
Purpose: 카메라 라인/각도 관리.
Example: "CAM A", "CAM B".
Related Domains: Asset, Output.
Lifecycle: planned -> active -> retired.
Owner: 영상 감독.
Future Expansion: 카메라 제어.

### Lighting
Definition: 조명 장비/프리셋.
Purpose: 조명 장비/프리셋/제어 관리.
Example: "프론트 라이트", "MOOD".
Related Domains: Cue, Controller, Plugin.
Lifecycle: planned -> active -> retired.
Owner: 조명 디자이너.
Future Expansion: 자동 제어.

### Audio
Definition: 사운드 장비/트랙.
Purpose: 오디오 라우팅/트랙/믹스.
Example: "BGM", "마이크 A".
Related Domains: Cue, Controller, Plugin.
Lifecycle: planned -> active -> retired.
Owner: 사운드 디자이너.
Future Expansion: 믹싱 프리셋.

### Video
Definition: 영상 장비/출력.
Purpose: 비디오 라우팅/출력.
Example: "미디어 서버 A".
Related Domains: Output, Cue, Plugin.
Lifecycle: planned -> active -> retired.
Owner: 영상 감독.
Future Expansion: 자동 전환.

### Effect
Definition: 장면/출력 효과.
Purpose: 영상/조명 효과 정의.
Example: "blur", "glitch".
Related Domains: Scene, Cue, Transition.
Lifecycle: defined -> applied -> deprecated.
Owner: 미디어 아티스트.
Future Expansion: 프리셋.

### Synchronization
Definition: 장치 간 시간 동기화.
Purpose: 멀티 장치 실행 타이밍 일치.
Example: "NTP sync", "MTC".
Related Domains: Timeline, Controller, Plugin.
Lifecycle: configured -> synced -> failed.
Owner: 기술 감독.
Future Expansion: 자동 동기화.

### Mapping
Definition: 출력과 물리 장치의 대응.
Purpose: 출력 라우팅/매핑 정의.
Example: "Layer 1 -> Projector A".
Related Domains: Output, Screen, Projector.
Lifecycle: defined -> active -> archived.
Owner: 기술 감독.
Future Expansion: 자동 매핑.

### Calibration
Definition: 장치 보정 데이터.
Purpose: 색상/기하/지연 보정.
Example: "Projector A color calibration".
Related Domains: Projector, Mapping.
Lifecycle: planned -> applied -> expired.
Owner: 기술 감독.
Future Expansion: 자동 보정.

## Domain Relationship

Project
└── Show
└── Workspace
└── IntegrationProfile

Project
└── Scene
└── Scene -> Cue
└── Scene -> Asset

Project
└── Prompt
└── Prompt -> GenerationJob

Project
└── Asset -> Render

Timeline
└── Sequence
└── Sequence -> Cue
└── Cue -> Action

Output
└── Screen -> Projector
└── Display -> Mapping
└── Mapping -> Calibration

Show
└── Performance
└── Performance -> Stage
└── Stage -> Venue

User
└── Organization
└── Role -> Permission

Plugin
└── Controller
└── Controller -> Lighting
└── Controller -> Audio
└── Controller -> Video

Event
└── Action
└── Action -> User

## Naming Rule
- Singular 사용
- PascalCase 사용
- 영문 기준 작성
- 약어 사용 금지

## Reserved Words
Project, Show, Scene, Cue, Asset, Timeline, Plugin, Workspace

## Forbidden Words
Movie -> 사용하지 않음
Clip -> Cue와 혼동
Folder -> Collection 사용

## AI Rule
Claude, Hermes, ChatGPT 모두 동일한 용어만 사용한다.
새로운 용어는 반드시 CTO 승인 후 추가한다.
