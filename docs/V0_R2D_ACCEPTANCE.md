# V0-R2D — Minimal Social / Relationship Context Acceptance

R2D keeps R2C's narrative behavior and adds only factual social distance for the Writer.

## Human gate

PASS is not "NPCs became ruder". PASS means the same Canon character responds differently when the social/relationship facts differ, without deterministic dialogue rules.

### A. Stranger Sera before the entrance ceremony

Fresh game. PC social status: 평민.

Input:

`세라에게 오늘 훈련은 어땠냐고 묻는다.`

Expected:
- R2C PC-authority behavior remains: no invented quoted PC line.
- Sera knows training has not happened yet.
- Because PC↔Sera is still `stranger / affinity 0`, she must not speak with already-earned familiarity or volunteer friendly practical coaching by default.
- Her exact response remains AI judgment from Sera Canon; no required phrase such as "뭔 소리야" exists.

### B. Stranger does not mean universal hostility

Repeat a fresh first-contact test with a socially open or curious character such as Sia or Lillia.

Expected:
- The system does not make every stranger hostile.
- NPC Canon personality and social identity remain decisive.

### C. Social status is pressure, not a class script

Use a commoner PC and first-contact noble NPCs with clearly different personalities.

Expected:
- Social difference may affect distance, formality, assumptions, or tension when the character would care.
- Different noble characters do not collapse into one "noble vs commoner" voice.
- No deterministic `noble => rude` behavior.

### D. Relationship continuity

After a genuine direct exchange, meet the same NPC again.

Expected:
- The NPC is no longer treated as a total stranger if the Writer recorded a relationship update.
- Mere observation or sharing a room does not increase familiarity/affinity.
- Ordinary affinity changes stay small and contextual.

## Explicit non-goals

- no affinity threshold table
- no dialogue unlocks
- no automatic +1 per turn
- no deterministic class prejudice table
- no Relationship Director
- no extra model call
- no canonical-time fix in this experiment

Do not merge until human original-feel acceptance.
