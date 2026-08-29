# V0 Status

## Current status

**V0 STRUCTURAL IMPLEMENTATION — READY FOR HUMAN NARRATIVE PREVIEW**

Branch: `codex/v0-pure-ai-narrative`

PR: #1 — V0 Pure AI Narrative Prototype

Merge status: **DO NOT MERGE YET**. Narrative quality is a human gate.

## Implemented

- minimal mobile novel UI
- free PC creation
- exact current USER ACTION preserved without truncation/rewrite up to 12,000 characters
- thin scene packet
- 0–3 full relevant Named Character packets
- bounded everyday-academy cast index for natural Named Character discovery
- visibility-filtered Canon knowledge
- one fixed Writer call (`gpt-5.6-terra` default)
- `store: false`
- free ordered narration/dialogue beat stream
- anonymous one-scene speakers without creating Canon NPC keys
- registered portrait/expression validation
- minimal narrative continuity: date/time/location/situation/present registered characters
- local save/export/import
- visible API errors outside fiction
- no automatic keyboard focus or response scroll theft

## Explicitly absent

- Suggested Actions
- AUTO / CONTINUE
- Event Engine
- Schedule Engine
- Scene Momentum / Scene Exit / Turn Hook
- participant queue
- generic actor routing
- NPC goal/simulation engine
- relationship mutation engine
- memory mutation engine
- skill/awakening engine
- Fate/Ending/Inheritance
- model routing by Korean keyword regex
- deterministic narrative scoring or rewriting

## Self-review corrections before preview

1. The first draft exposed all 32 characters in the ambient cast index. It was narrowed to ordinary academy cast so apostles, archbishops, gods, and high-tier secret figures are not suggested merely because the Writer knows their names.
2. The first draft only allowed registered NPCs to speak. Anonymous students/staff may now use `speaker_name` for a single scene without inventing a canonical key.
3. The first draft automatically scrolled to the bottom after a generated response. Automatic response scrolling was removed; the mobile client does not steal focus or scroll position.
4. Time validation now accepts only real `HH:MM` values.

## Automated gate

Repository CI checks syntax and hard invariants. A green CI result does **not** mean narrative acceptance.

## Exact next action

Deploy PR #1 to a Preview environment with:

- `OPENAI_API_KEY`
- `OPENAI_MODEL=gpt-5.6-terra`
- optional `LUMENSIA_ACCESS_TOKEN`

Then perform a very small human gate first.

### Gate 0 — opening

Create a PC and enter a simple action such as:

`대강당 안으로 들어간다.`

Judge only whether the result already reads as a living fantasy-fiction scene: world initiative, meaningful character presence, natural compression of the remaining wait, no RPG report/tutorial voice, no fake choice-return, correct PC identity.

If Gate 0 plainly fails, stop immediately and fix the thin Writer path. Do not spend additional model usage on the larger suite.

If Gate 0 passes, run only two more cheap probes before the full benchmark:

- short action that should expand into a scene
- broad intent that should compress routine time naturally

Only after those pass should the full `reference/QUALITY_BENCHMARK.md` acceptance suite be run.
