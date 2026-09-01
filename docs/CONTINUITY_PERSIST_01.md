# CONTINUITY-PERSIST-01

## Scope

- Durable semantic continuity memory from the existing unified State Keeper.
- Scene-state persistence for date/time/location/situation/present registered cast.
- Situation/narration composer input distinct from PC intent.
- Visible semantic growth traces before rank-up.
- Minimal PC-intensity authority boundary: strong/bizarre PC facts do not automatically summon proportional threats or backstory echoes.
- Procedural interrogation boundary: once core safety facts are known, routine intake/reporting questions compress instead of consuming one turn each.
- Exceptional-PC premise normalization: unusual origin/status/equipment are a playable starting premise, not an automatic long-running investigation or containment arc. If there is no current threat and the user is not choosing to investigate the mystery, routine checks move offscreen and academy life becomes accessible.
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

- Golden3 Writer prompt source remains unchanged.
- One Writer narrative call.
- One unified State Keeper bookkeeping call.
- Paste-settings is local browser parsing only.
- No Director, event stage, scheduler, threat scaler, NPC selector, intake/admission state machine, numeric XP/affection engine, or extra model call.
