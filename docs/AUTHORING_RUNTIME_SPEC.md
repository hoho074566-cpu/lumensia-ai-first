# Lumensia Authoring Runtime Specification

Status: DESIGN FROZEN FOR AUTHORING-RUNTIME-01

## Prime directive

AI의 서사 판단을 코드로 대신하지 않는다. 코드는 제작자가 설정한 재료를 정확히 조립하고, Canon/런타임 상태를 보존하며, 모델 호출 결과를 안전하게 전달할 뿐이다.

이 런타임은 Narrative Engine이 아니다. Crack류 제작 플랫폼에서 하나의 작품을 구성할 때 존재하는 제작 계층을 Lumensia의 factual Canon 위에 재현하는 Authoring Runtime이다.

## 1. Crack 제작 UI -> Lumensia Runtime 1:1 mapping

| Creator surface | Runtime layer | Writer visibility | Responsibility |
| --- | --- | --- | --- |
| 프롬프트 템플릿 | Base RP Template | Always | 인터랙티브 픽션 세션의 일반 행동양식만 정의 |
| 스토리 설정 | Main Author Prompt | Always | 작품 정체성, 세계의 생활감, 주연군, 관계 긴장, 나레이션 성격 |
| 애드온 | Lore Modules | Relevant/selected | Structured Canon을 AI가 읽기 좋은 자연어 설정 블록으로 표현 |
| 전개 예시 | Development Examples | Always, max 3 | 규칙 설명이 아니라 실제 user -> writer 장면 예시로 호흡/문체/상호작용을 시연 |
| 시작 설정 | Start Setting | Opening only | 프롤로그와 최초 상황. 이벤트 순서표가 아님 |
| 스탯 설정 | Runtime State Prompt | Every turn | 현재 시간/장소/PC/관계/부상/장비/지식 등 현재 사실을 간결하게 표현 |
| 키워드북 | Conditional Lore Books | Turn-local | 이번 입력/현재 장면에 필요한 세부 정보만 조건부 추가 |
| 미디어 | Media Layer | Outside Writer core | 장면 결과를 바탕으로 이미지/표현 선택. 서사 판단에 개입하지 않음 |
| 단축어 | Shortcut Layer | Before Writer | 사용자 버튼을 평범한 사용자 입력 문자열로 변환 |
| 엔딩 설정 | Ending Layer | Conditional only | 별도 eligibility가 충족될 때만 ending 자료 제공 |
| 프로필/등록 | Metadata/UI | No | 작품 표시용 메타데이터. Writer 행동을 규정하지 않음 |

이 매핑은 AUTHORING-RUNTIME-01에서 고정한다. 출력 문제가 발생해도 별도 Narrative Director 계층을 추가하지 않는다.

## 2. Prompt assembly order

정상 플레이의 단일 Writer 호출 입력은 아래 순서로 조립한다.

1. BASE RP TEMPLATE
2. MAIN AUTHOR PROMPT
3. RELEVANT LORE MODULES
4. START SETTING (opening only)
5. DEVELOPMENT EXAMPLES (max 3)
6. CURRENT RUNTIME STATE
7. ACTIVE KEYWORD BOOKS
8. RECENT CHAT
9. EXACT USER INPUT
10. ONE WRITER CALL

Continue/Admin은 사용자 행동과 구분되는 mode envelope만 추가한다. 별도 AI planner나 selector를 호출하지 않는다.

## 3. Base RP Template

### May do
- Narrator와 NPC를 담당하는 인터랙티브 픽션 Writer의 역할을 정의한다.
- 사용자가 PC의 새로운 의도와 의미 있는 선택을 소유한다는 점을 정의한다.
- NPC와 세계가 자기 이유로 움직일 수 있음을 정의한다.
- 출력이 RPG 보고서/튜토리얼이 아니라 몰입형 소설 장면임을 정의한다.
- 평범한 연결 과정은 자연스럽게 압축하고, 살아 있는 장면은 충분히 이어갈 수 있음을 정의한다.
- 제공된 사실이 권위 있고 미정 사실은 미정이라는 원칙을 정의한다.

### Must not do
- Lumensia 고유 캐릭터/장소/이벤트를 포함하지 않는다.
- 특정 NPC를 등장시키라고 지시하지 않는다.
- hook/scene score/beat quota/paragraph quota를 정의하지 않는다.
- Event Director, schedule engine, scene planner 역할을 맡지 않는다.

## 4. Main Author Prompt

### May do
- Lumensia Academy가 어떤 작품인지 자연어로 설명한다.
- 사람을 움직이는 동기: 신분, 야망, 생존, 경쟁, 호기심, 관계 등을 설명한다.
- 초반 핵심 주연군을 짧은 자연어 캐릭터 카드로 소개한다.
- 주요 관계 긴장을 설명한다.
- 작품의 기본 서술 성격과 대화 호흡을 설명한다.

### Must not do
- 모든 32명과 모든 세계관 세부를 항상 넣지 않는다.
- 사용자의 행동에 대한 NPC 반응을 if/then 스크립트로 작성하지 않는다.
- 오래된 Add-on 공개 설명을 현재 Canon보다 우선하지 않는다.
- 사건 진행 순서를 지정하지 않는다.

## 5. Structured Canon -> Lore Modules

Structured Canon은 source of truth다. Lore Module은 Writer용 표현층이다.

- 사실 출처: reconciled Canon / dated scenario / runtime state.
- 표현: 짧고 읽기 쉬운 자연어 설정 카드.
- 카드에는 사실뿐 아니라 Canon이 직접 뒷받침하는 동기/역할/분위기를 자연어로 묶을 수 있다.
- 원작 공개 Add-on은 정보 밀도와 표현 방식의 참고 자료이지 current truth authority가 아니다.
- `KNOW != MENTION`: Lore를 받았다고 서술에 반드시 사용하지 않는다.
- `LORE != EVENT`: Lore가 활성화됐다고 사건을 발생시키지 않는다.

## 6. Development Examples

최대 3개. 추상 규칙 설명을 넣지 않는다. 실제 user -> writer 장면 형태로 작성한다.

AUTHORING-RUNTIME-01 예시 범주:
1. 평범한 일상/관계: routine은 자연스럽게 지나가고, 사람 간 반응이 생기면 장면이 그 반응에 머문다.
2. 살아 있는 다인 장면: NPC끼리도 자기 목적과 subtext를 가지고 움직이며 PC를 중심으로 줄 서지 않는다.
3. 전투/긴장: 행동 -> 상대 반응 -> 달라진 다음 공방이 이어지며 결과가 상태에 남는다.

예시의 고유 인물/장소/물건은 Canon이 아니며 현재 장면으로 복사하지 않는다.

## 7. Start Setting

Start Setting은 첫 장면의 제작 재료다.

- Prologue: 시대/장소/작품 시작의 정서적·세계적 배경.
- Start situation: 정확한 현재 위치와 주변 상황.
- 미정 개인 배정/비밀/시간표는 확정하지 않는다.
- 이벤트 순서, mandatory encounter, NPC 출연 순서를 적지 않는다.
- 정상 history가 생긴 뒤에는 prompt에서 제거한다.

## 8. Runtime State Prompt

내부 state는 구조적으로 유지하지만 Writer에는 간결한 현재 상태로 표현한다.

최소 범주:
- date/time/location/situation
- PC identity and relevant current condition
- present known characters
- persistent injuries/conditions
- equipment facts relevant to current scene
- relationship state when relevant
- acquired/visible knowledge when relevant
- confirmed schedules only when currently relevant

State는 story beat가 아니다. 12:00 일정이 존재한다고 12:00까지 서사를 끌고 가지 않는다.

## 9. Conditional Lore Books

Keyword Book은 Add-on/Lore와 별개다.

- 이번 입력/장면에 필요한 세부 지식만 조건부로 추가한다.
- activation은 information retrieval일 뿐 narrative selection이 아니다.
- 한 턴에 과도한 book flood를 피한다.
- Restricted knowledge는 explicit acquired/visible evidence가 없으면 fail closed.

예시 범주: 제국법/보안국, 마신교 위계, 황위 계승 현재 상태, 특정 장소 세부, 고급 경지 규칙.

## 10. Media / Shortcut / Ending boundaries

### Media
Writer 결과 이후 장면의 등장인물/expression/situation을 표시하는 UI 계층이다. Writer에게 이미지 선택을 위한 서사 왜곡을 요구하지 않는다.

### Shortcuts
사용자가 누르는 명령을 일반 사용자 action text로 변환한다. 시스템 행동으로 우회하지 않는다.

### Ending
별도 deterministic eligibility는 factual gate로만 사용할 수 있다. eligibility가 참일 때 ending authoring material을 Writer에 제공할 수 있으나, 평상시 Writer가 매 턴 ending을 탐색하지 않는다.

## 11. One-call architecture guard

Allowed:
- deterministic factual validation
- deterministic state persistence
- deterministic text/lore assembly
- deterministic keyword/lore retrieval
- one final Writer model call

Forbidden:
- Event Director / Event Engine
- Scene Planner / Scene Selector
- NPC selector score / cast rotation
- hook score / attention meter / novelty budget as runtime selector
- prose quotas / paragraph quotas / dialogue quotas
- separate AI beat picker
- AI schedule planner
- AI summary call in the critical write path

## 12. Failure routing: fix the authoring layer, not the architecture

| Failure | First layer to inspect |
| --- | --- |
| 캐릭터 목소리/성격이 틀림 | Main Author Prompt / character Lore |
| 첫 장면이 밋밋함 | Start Setting / Development Example |
| 문체가 보고서/튜토리얼 같음 | Base RP Template / Main Prompt tail / Development Examples |
| broad action이 장소 목록이 됨 | Development Examples / Main Prompt narration guidance |
| NPC가 PC를 기다리기만 함 | Base RP Template / Main Prompt world premise |
| 없는 사실 발명 | Lore / Conditional Book / Runtime State / factual validation |
| 관계 기억 이상 | Runtime State / relationship persistence |
| 관련 없는 정보가 튐 | Conditional Lore activation |
| 이미지가 이상함 | Media Layer |
| 엔딩이 이상함 | Ending Layer |

새 narrative-control subsystem 추가는 기본 해결책이 아니다.

## 13. AUTHORING-RUNTIME-01 implementation scope

1. 이 문서를 frozen contract로 추가한다.
2. Canon-base에서 새 branch를 만든다. #20/#21의 Writer assembly를 상속하지 않는다.
3. `data/authoring/`에 Base/Main/Start/Examples/Lore authoring data를 둔다.
4. `api/lib/authoring-runtime.js`가 고정된 assembly order를 구현한다.
5. `api/write.js`는 safe state -> authoring assembly -> one Writer call -> safe validation만 수행한다.
6. dialogue speaker 누락은 전체 턴 실패 대신 narration으로 fail-soft한다.
7. Copy / dedicated Continue / non-mutating Admin Preview는 독립 UX로 다시 도입할 수 있다. 이 기능들은 narrative selection에 관여하지 않는다.
8. 구조 테스트는 layer boundary와 one-call invariant만 검증한다. prose quality를 regex로 통과시키지 않는다.
9. qualitative Preview acceptance를 통과하기 전 Draft 상태를 유지한다.

## 14. Acceptance probes

Human Preview는 최소 다음을 반복 검증한다.
- untouched opening
- `입학식을 마치고 생활동으로 가서 짐을 정리한다.`
- `시간이 남으니 아카데미 주변을 천천히 둘러본다.`
- `기사과 훈련장에 가본다.`
- `특별히 할 일 없이 잠시 주변을 지켜본다.`
- NPC 제안 거절
- 여러 날의 평범한 수업/훈련 압축
- 실패가 남는 전투

평가 기준은 규칙 문자열의 존재가 아니라 실제 플레이에서의 장면 생동감, PC autonomy, factual integrity, 캐릭터 구분, scene depth다.
