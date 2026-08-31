# Lumensia Crack-Style Authoring Runtime Specification

Status: CRACK-RUNTIME-01 PREVIEW CANDIDATE

## Prime directive

AI의 서사 판단을 코드로 대신하지 않는다. 코드는 제작자가 설정한 재료를 조립하고 Canon/런타임 상태를 보존하며, 최종 Writer 호출 결과를 안전하게 전달할 뿐이다.

이 런타임은 Narrative Engine이 아니다. **Crack-style Creator Pack**을 Lumensia의 reconciled Canon 위에 구현한다.

## 1. Creator surfaces

| Crack-style surface | Lumensia implementation | 의미 |
| --- | --- | --- |
| Prompt Template | `prompt_template` | 작품과 무관한 RP 권한/자율성/출력 계약 |
| Story Settings | `story_settings` | 루멘시아의 장르·작품 방향·문체·진행 감각 |
| Add-ons | Scenario/World/Character Add-ons | AI가 장면을 판단할 때 읽는 제작 재료 |
| Development Examples | 최대 3개 | user→writer 실제 장면 예시 |
| Start Settings | 첫 턴만 | 프롤로그 + 정확한 시작 상황 |
| Stats / Runtime State | 매 턴 | 현재 PC·날짜·시각·장소·장비·상태 |
| Keyword Books | 문자 키워드 매칭 | 특정 세부 세계관 자료를 조건부 추가 |
| Recent Chat | 최근 턴 | 실제 진행 문맥 |
| Exact User Input | 마지막 레이어 | 사용자의 원문 의도 |
| Media | Writer 밖 UI | 등록 캐릭터 이미지/표정 표시 |
| Shortcuts / Continue | Writer 입력 모드 | 가짜 PC 행동 없이 사용자 명령을 전달 |
| Ending | 별도 factual gate | 평상시 서사 선택에 개입하지 않음 |

## 2. One Writer call

정상 플레이 조립 순서:

1. Prompt Template → `instructions`
2. STORY SETTINGS
3. ADD-ONS
4. START SETTINGS — untouched opening only
5. DEVELOPMENT EXAMPLES — max 3
6. RUNTIME STATE
7. KEYWORD BOOKS
8. RECENT CHAT
9. EXACT USER INPUT
10. ONE WRITER CALL

Continue는 마지막에 `MODE: CONTINUE`, Admin은 `MODE: ADMIN PREVIEW`를 넣는다. 별도 planner/selector/model call은 없다.

## 3. Add-ons

### Academy scenario

현재 시나리오가 아카데미이므로 다음 Add-on은 항상 활성화한다.

- Academy world Add-on
- dated scenario Add-on
- `presence = academy_student | academy_faculty | academy_guest`인 모든 현재 생활권 캐릭터 Add-on

**중요:** 이것은 cast selector가 아니다. 코드가 “누구를 등장시킬지” 고르지 않는다. 현재 생활권의 제작 재료를 Writer에게 제공하고, 실제 장면에서 누구를 쓸지는 Writer가 판단한다.

현재 아카데미 밖 캐릭터는 이름/key가 입력·현재 상황·최근 대화에서 문자 그대로 언급될 때 Add-on을 활성화할 수 있다. 이것은 Crack식 keyword activation이며 서사 점수화가 아니다.

Character Add-on에는 가능한 범위에서:

- durable identity/background/personality
- values/aspiration/interests/activities
- combat identity/capabilities/limitations
- voice/register/tendencies/avoid
- verified presentation
- dated current state
- Canon relationships/group attitudes

를 함께 둔다.

Author-facing character truth는 player/NPC의 자동 지식이 아니다.

## 4. Scenario facts are not a route

`09:00 입학식 예정`, `12:00 1학년 오리엔테이션 예정` 같은 dated fact는 Scenario Add-on의 사실이다.

코드는 현재 시각과의 거리로 “relevant schedule”을 계산하지 않는다.
Writer는 일정이 존재한다는 이유로:

`입학식 → 생활동 접수 → 방 열쇠 → 훈련`

같은 절차 코스를 자동 생성하지 않는다.

Canon에 없는 접수 방식, 열쇠 배부, 이의 신청, 통금, 방 번호, 행정 순서는 미정이다.

## 5. Keyword Books

Keyword Book은 단순 문자 매칭으로만 활성화한다. 이것은 narrative relevance 판단이 아니다.

예:
- 생활동/기숙사 → housing
- 마나/오러/경지/마법 → power
- 법/보안국/범죄 → law
- 길드/의뢰 → adventurer guild
- 도미너스/교회/성녀 → religion
- 금화/가격/비용 → economy

Book을 받았다는 이유로 본문에 언급하거나 사건으로 만들 필요는 없다.

## 6. Start Settings

Start Settings는 history가 없는 정확한 시작 상태에서만 제공한다.

- 프롤로그
- scenario baseline의 exact date/time/location/situation
- start rule
- play guide

이후 사건 순서나 조우 순서를 포함하지 않는다.

## 7. Runtime State

Runtime State는 현재 사실을 그대로 제공한다.

- date/time/location/situation
- player identity/profile
- realm/circle
- Trait/Authority
- skills/equipment/resources
- previous continuity의 present character keys

State는 story beat가 아니다.

## 8. Development Examples

최대 3개를 유지한다.

현재 CRACK-RUNTIME-01 예시는:
1. Sia의 character-specific initiative
2. broad intent가 Mirabelle의 실제 생활 장면에 착지
3. 전투 결과 → 비용 → 다음 압박

예시는 현재 장면의 인물·장소를 반복하라는 명령이 아니다.

## 9. Forbidden

- Event Director / Event Engine
- Scene Planner / Scene Selector
- NPC selector/scoring/rotation
- imminent-schedule routing
- hook score / attention meter
- prose quota
- AI beat picker
- AI schedule planner
- extra narrative model call
- hidden procedure generation

## 10. Preserved product behavior

Writer rebuild와 무관하게 유지한다.

- reconciled Canon
- save/runtime state
- structured scene output
- registered character portraits
- per-scene Copy
- dedicated 이어하기
- Admin Preview
- one Writer call

Copy와 이어하기는 regression test로 고정한다.

## 11. Human acceptance

Fresh-save Preview에서 확인:

- chat blind-test O3 계열 문체/진행 감각이 재현되는가
- Artemis/Emily 같은 캐릭터 사실이 섞이지 않는가
- 주요 캐릭터가 자연스럽게 사용되면서 generic도 유지되는가
- 일정이 자동 학교 코스로 변환되지 않는가
- 없는 행정 디테일이 발명되지 않는가
- broad intent가 CCTV 몽타주가 아니라 실제 장면에 착지하거나 깔끔히 완료되는가
- 전투가 결과→새 상태로 이어지는가
- Copy/이어하기가 그대로 동작하는가

Human qualitative acceptance 전에는 Draft / Do Not Merge다.
