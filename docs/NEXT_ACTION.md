# Next Action

## Current accepted baseline

Repository: `hoho074566-cpu/lumensia-ai-first`

Golden3 is the human-accepted Writer regression floor.

- production Writer mode: **COMPACT / RAW**
- one narrative Writer call
- no narrative Director / selector / scheduler machinery

Active top stack: **PR #42 — CONTINUITY-PERSIST-01** (`codex/continuity-persist-01`), Draft / unmerged.

## Current implementation state

PR #42 now contains the continuity feature plus the health-fix pass discovered during live testing:

- semantic continuity memory and current scene state
- latest-5-turn Writer context diet
- PC core-fact salience
- present-cast release / completed-procedure release
- situation input
- growth + relationship State Keeper bookkeeping
- factual equipment / condition / gold persistence
- long-scene beginning+ending State Keeper input
- full saved play history with paged mobile rendering
- State Keeper failure retry
- stale opening/schedule fact removal
- full accepted PC background/profile feed
- comma-safe line-based PC list fields
- canonical full-name character-art resolution
- periodic runtime health audit regression

The accepted Golden3 `prompt_template` remains protected.

## Exact next action

1. Finish full automated verification on the exact latest PR #42 head.
2. Confirm Vercel exact-head success.
3. Run fresh-save human qualitative gameplay using the gate below.
4. If a repeatable defect appears, fix the smallest factual/context/state cause and rerun the full suite.
5. If the gate passes, report PR #42 ready for human merge decision. Do not merge merely because CI is green.

## Human gate

Verify:

- strong/long PC facts materially affect plausible judgment
- quiet strong-PC life remains possible without automatic escalation
- unusual origin does not become endless institutional intake
- demonstrated expert competence changes stale assumptions when warranted
- Artemis does not default to novice tutorial behavior against proven expertise
- same Named NPCs do not repeat merely due to saved present cast/history inertia
- emotional range remains character-specific rather than uniformly calm/flat
- routine evaluation/intake ends when its purpose is satisfied
- actual present danger still gets natural consequences
- important continuity survives beyond the 5-turn raw window
- Writer-confirmed equipment/injury/gold changes persist into INFO and next turn
- long-scene final consequences are retained
- >40-turn history is preserved and older turns can be opened
- bookkeeping retry works without regenerating Writer prose
- Golden3 prose quality remains at the accepted level

## Do not do

Do not reintroduce:

- Event Director / Event Engine
- prose-controlling Schedule Engine
- NPC selector scores / cast rotation/cooldown
- threat scaler / emotion score
- hook / attention / event-density meters
- prose quotas
- Korean semantic-regex narrative control
- extra planning model calls merely to choose the next beat

## Deferred

A complete mutable NPC long-term state overlay (year/office/realm/presence changes) is deferred until actual long-duration gameplay requires it. Do not solve it with an NPC simulation or schedule engine.

Read `docs/HEALTH_AUDIT.md` for periodic whole-game verification.

`GOLDEN3_BASELINE: ACCEPTED`

`HANDOFF_READY: PASS`

`NEXT_ACTION: exact-head automated verification -> fresh-save human PR #42 acceptance -> merge decision only after qualitative PASS.`