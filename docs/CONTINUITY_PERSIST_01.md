# CONTINUITY-PERSIST-01

## Scope

- Durable semantic continuity memory from the existing unified State Keeper.
- Scene-state persistence for date/time/location/situation/present registered cast.
- Situation/narration composer input distinct from PC intent.
- Visible semantic growth traces before rank-up.
- One consolidated PC premise authority principle: PC settings, abilities, origin, and demonstrated actions are world facts rather than automatic plot commands. NPC/world reactions depend on observable facts plus their own knowledge, experience, and personality; new evidence updates prior judgments, distance, and role assumptions. Strong or unusual PCs do not automatically escalate danger, investigation, isolation, interrogation, or research, and procedures compress once their purpose is satisfied so ordinary life/story flow can resume. Anti-escalation does not suppress character-specific emotional reactions.
- Writer context balance: raw recent-chat context is limited to the latest 5 turns while older durable facts stay in semantic continuity memory; PC realm/talents/stats are grouped as high-salience core facts; present-character keys are continuity facts rather than a fixed cast recommendation.
- State Keeper cast release: characters are removed from present cast when the scene, time, schedule, or their own action naturally takes them away; completed procedures/evaluations/reports are not retained as active situation/open threads.
- Development-example temperature balance: the novice Artemis drill example was replaced by an Emily scene that demonstrates visible emotional-mode change while keeping the accepted Golden3 prompt template unchanged.
- PC creator current-condition persistence is repaired so the `현재 상태` field reaches the run state and Writer runtime.
- Local PC creator `설정 붙여넣기`: human-readable setting blocks or JSON/exported save `pc` data can populate creator fields without any model/server call.

## Paste-settings format

Human-readable example:

```text
이름: 아사
나이: 24
학과: 기사과
무의 경지: 익스퍼트 상급
재능: 마법 2 / 무 10 / 영혼 8 / 지식 6
스탯: 신체 A+ / 마나 B / 지능 C+ / 신성 F
배경: 다른 세계의 전장에서 싸웠다.
스킬:
사복검술:A
전장 감각:A+
장비:
탄약 추진식 사복검
```

Also accepts a JSON PC object or an exported run object containing `pc`.
Only recognized fields overwrite the current creator form, so partial paste is allowed.

## Architecture boundaries

- Golden3 Writer prompt template remains unchanged.
- One Writer narrative call.
- One unified State Keeper bookkeeping call.
- Paste-settings is local browser parsing only.
- No Director, event stage, scheduler, threat scaler, NPC selector, cast rotation/cooldown system, emotion score, intake/admission state machine, numeric XP/affection engine, or extra model call.
