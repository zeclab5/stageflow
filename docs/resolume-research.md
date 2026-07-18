# Resolume Composition / Layer / Clip 구조 및 핵심 제어 명령 조사

이 문서는 StageFlow 플러그인 개발을 위해 Resolume의 핵심 데이터 구조와 제어 방법을 공식/커뮤니티 자료로 정리한 것이다.
- 참고 소스: StageFlow `plugins/resolume/src/index.ts`, `apps/api/src/plugins/ResolumePlugin.ts`
- 참고 문서: Resolume 공식 지원 문서 (Composition, Layers, Clips, OSC, REST API, WebSocket API)

---

## 1. 상위 구조 개요

```text
Composition
└── Layers
    └── Clips
        └── Source / effects / parameters
```

- **Composition**은 최종 출력 단위다. 해상도, 프레임레이트, 레이어 합성, 마스터 이펙트, 오디오 믹스 등을 가진다.
- **Layer**는 Composition 내에서 하단에서 상단으로 합성되는 “한 장의 물감” 단위다. 비디오 오버레이, 트랜지션, 오디오 볼륨/팬, 블렌드 모드 등을 가진다.
- **Clip**은 레이어에 재생되는 실제 미디어다. 비디오, 이미지, 오디오, 라이브 입력, Wire 소스 등이 들어간다.

---

## 2. Composition

### 2.1 역할
- 모든 레이어를 합성하고, 마스터 이펙트를 거쳐 출력/스크린으로 보낸다.
- Advanced Output을 통해 서브 출력, Spout/Syphon, NDI 전송도 가능.

### 2.2 주요 속성
- **Name / Description**: 식별 및 메타데이터
- **Size**: 출력 해상도
- **FrameRate**: 프레임 제한 또는 자동 동기화
- **Bit Depth**: 8 / 16 bpc
- **Master opacity**: 전체 투명도
- **Master speed**: 전체 재생 속도. BPM 싱크 클립에는 영향 없음.
- **Audio master volume / pan**
- **Video fade out**
- **Crossfader**: 버스 A/B 할당 후 혼합
  - Blend mode, curve, behavior (Jump / Cut / Fade)

### 2.3 전역 제어
- **Direction controls**: 전체 재생 방향 (정방향 / 일시정지 / 역방향)
- **Beat snap, clip target, trigger style** 등을 컴포지션 기본값으로 지정 가능

---

## 3. Layer

### 3.1 역할
- Composition 내의 단일 요소로, 여러 클립과 이펙트를 수용한다.
- 하단 레이어부터 상단으로 합성됨. 위치 순서 변경 가능.

### 3.2 주요 속성
- **Video**
  - **Blend mode**: 레이어 합성 방식 (Add, Alpha, Darken 등 50+ 모드)
  - **Opacity**: 비디오 투명도
  - **Width / Height**: 렌더 해상도
  - **Auto size**: Off / Fill / Fit / Stretch
- **Audio**: Volume, Pan
- **Transport controls**
  - Speed, direction, loop mode
  - playhead 이동 가능
- **Layer transition**
  - 새 클립 트리거 시 이전 클립에서 새 클립으로 전환
  - 기본은 Alpha 크로스페이드
  - 지속 시간: 0~10초
  - 모드: 기본 블렌드/트랜지션 + 랜덤
- **Layer properties 동작**
  - Auto Pilot: 자동 클립 진행
  - Fader Start: 페이드 업 시 클립 재시작
  - Ignore column trigger: 특정 레이어를 컬럼 트리거에서 제외
  - Lock content: 현재 클립 자동 배치 방지
  - Mask mode: All Below / One Below

### 3.3 OSC 주소 예시
```text
/composition/layers/1/video/opacity
/composition/layers/1/video/mixer/blendmode
/composition/layers/1/video/effects/transform/scale
/composition/layers/1/video/effects/transform/positionx
/composition/layers/1/video/effects/transform/rotationz
```

---

## 4. Clip

### 4.1 역할
- 실제 미디어를 담는 단위로, 비디오, 이미지, 오디오, 라이브 입력, 저장된 스냅샷 등이 가능하다.
- 열(Column) 단위로 배치되며, 같은 칼럼 내 클립들은 보통 한 레이어의 자리를 경쟁한다.

### 4.2 주요 속성
- **Loading**
  - 파일 패널 드래그 앤 드롭
  - 더블 클릭으로 미리보기
- **Triggering**
  - 썸네일 클릭 또는 컬럼 트리거
  - Trigger style: Normal, Toggle, Piano, Fader Start
  - Beat snap, clip target
- **Transport**
  - Play / Pause / Reverse
  - Speed, loop mode, in/out points
  - Transport position
- **Video Properties**
  - **Opacity**
  - **Width / Height**
  - **Blend Mode** (클립 재생 중 레이어 설정 오버라이드)
  - **Alpha Type**: Premultiplied / Straight
  - **Fill / Fit / Stretch / Original**
- **Audio Properties**
  - Volume, Pan
- **Persistent Clip**: 덱을 넘어 유지되는 클립

### 4.3 썸네일 -> 트리거 흐름 요약
1. 파일 패널에서 클립을 Layer slot에 로드
2. 썸네일 클릭 시 해당 레이어에서 클립 재생
3. 컬럼 트리거로 여러 클립 동시 재생 가능

---

## 5. 핵심 제어 표면

StageFlow 플러그인은 3가지 통신 모드를 지원한다:
- **REST**
- **OSC**
- **WebSocket**

아래는 각 채널에서의 핵심 제어 포인트다.

### 5.1 REST API
- 기본 엔드포인트: `http://{host}:{port}/api/v1`
- 공식 문서: https://resolume.com/docs/restapi/ (
  - Arena/Avenue API: https://resolume.com/docs/restapi/
  - Wire API: https://resolume.com/docs/wirerestapi/
)
- iv.<시작>

#### Composition
- `GET /composition/list_composition`
- `POST /composition/select/{compositionId}`
- `GET /composition/get/{compositionId}`

#### Clips
- `POST /clip/trigger/{compositionId}/{clipId}`

### 5.2 WebSocket API
- 기본 엔드포인트: `ws://{host}:{port}/api/v1`
- 수신 메시지 예 (연결 직후):
  - Composition state
  - Sources update
  - Effects update
- 요청 형식:
  ```json
  { "action": "<action>", "parameter": "<parameter path>" }
  ```
- Action:
  - `subscribe`, `unsubscribe`, `set`, `get`, `reset`, `trigger`
- Path 예:
  - `/composition/columns/1/name`
  - `/composition/layers/1/video/mixer/blendmode`
- Structural Actions:
  - `post`, `remove`

### 5.3 OSC
- 기본 포트: `7000` (설정에서 변경 가능)
- 모든 항목은 고정된 OSC 주소로 제어 가능
- 일반적인 주소 패턴:
  ```text
  /composition/layers/{layer}/clips/{clip}/transport/...
  /composition/layers/{layer}/video/...
  /composition/video/effects/transform/...
  ```

#### 타입 태그 / 값 범위 예시
- `Float 0.0 - 1.0 (range 0.0 - 1000.0)` → 0.5 는 중간값
- `Float 0.0 - 1.0 (range -180.0 - 180.0)` → 회전
- `Int` → 0~N 정수

#### 조작 예시
- `/composition/layers/2/clips/8/transport/position 0.0`
- `/composition/layers/1/video/opacity 0.25`
- `/composition/layers/1/clips/1/video/effects/transform/positionx "a" 320`
- `/composition/layers/1/video/effects/transform/positionx "+" 50`

---

## 6. 핵심 제어 항목 매핑

### 6.1 불러오기
- REST: `POST /composition/select/{compositionId}`
- REST: `get_composition`
- OSC/WebSocket: 라이브 리스트에 있는 clip/layer/column 구조 접근

### 6.2 재생
- REST: `POST /clip/trigger/{compositionId}/{clipId}`
- OSC 예: `/composition/layers/{layer}/clips/{clip}/transport/transport trigger`
- 속성: play / stop / direction / loop mode

### 6.3 위치 / 크기 / 회전
- Clip/Layer/Composition 모두 transform 가능
- 클립 예: `/composition/layers/{layer}/clips/{clip}/video/effects/transform/positionx`
- 클립 예: `/composition/layers/{layer}/clips/{clip}/video/effects/transform/scale`
- 클립 예: `/composition/layers/{layer}/clips/{clip}/video/effects/transform/rotationz`
- 레이어/컴포지션 also: `/composition/video/effects/transform/...`

### 6.4 트랜지션 시간
- 기본은 레이어 전역 설정
- 레이어: Layer Transition slider, Layer panel에서 ms 단위까지 설정 가능
- 클립별 트랜지션 역시 지원: Transition panel에서 blend mode + duration override 가능
- 기본 설정은 `Layer Determined`

### 6.5 속도
- Composition master speed
- Layer/Clip speed
- BPM sync 일 때는 master BPM에 따르며, master speed가 영향 없음


## 7. StageFlow 플러그인과의 연관

StageFlow 내 `ResolumePlugin`은 REST/OSC/WebSocket 3가지 모드를 지원한다.
- REST 모드:
  - `findCompositions()` -> `list_composition`
  - `activateComposition()` -> `select/{id}` POST
  - `triggerClip()` -> `clip/trigger/{compositionId}/{clipId}` POST
  - `getRenderTree()` -> `composition/get`
- OSC/WebSocket 모드:
  - `onCueTriggered()` 를 통해 `/composition/{compositionId}/select` POLL 또는 OSC 메시지로 매핑 가능

---

## 8. 참고 링크
- https://resolume.com/support/en/composition
- https://resolume.com/support/en/layers
- https://resolume.com/support/en/clips
- https://resolume.com/support/en/osc
- https://resolume.com/support/en/restapi
- https://resolume.com/support/en/websocket-api
- https://resolume.com/docs/restapi/
- https://resolume.com/docs/wirerestapi/
