# GOLDEN3 — Accepted AI-First Writer Baseline

## Status

- Human accepted: YES
- Promoted to `main`: PR #35
- Accepted source head: `29c9ab29d1e051bd468cd90cf163d79a3ac41343`
- Promotion merge commit: `05d4765a1f4e0eb1e8c956f5260606a51ee8ddc0`
- Production Writer mode: **COMPACT / RAW**

Golden3 is the regression floor for Writer behavior. Future runtime and feature work may extend state persistence, UI, media, memory and mechanics, but must not casually re-tune away the accepted scene behavior.

## Human acceptance signal

The strongest CHAT-PARITY result was COMPACT / RAW. Follow-up human probes confirmed that the Writer can:

- advance the world instead of stopping because time remains before a scheduled event;
- compress routine movement, waiting, setup and ordinary procedure;
- expand important conversation, relationship, discovery, conflict and combat scenes;
- use plausible Named Canon characters without cast quotas, selector scores or rotation;
- preserve the user's meaningful PC actions, dialogue, emotions and choices;
- interpret minor typos/underspecified intent naturally when a setting-consistent reading exists;
- hand the turn back through the live scene instead of fake choice menus.

## Writer principles

1. **World motion** — the world does not freeze waiting for the next PC input.
2. **Routine compresses** — single-outcome movement/wait/setup/procedure may pass quickly.
3. **Important moments expand** — depth follows agency, tension, relationship and consequence, not elapsed clock time.
4. **Named cast stays available** — do not hide plausible Canon characters merely to avoid crowded scenes.
5. **Player authority stays protected** — do not invent the user's new important action, dialogue, emotion or decision.
6. **Canon is a foundation, not a cage** — minor everyday/spatial/class/custom/extra details may be inferred when consistent with supplied facts.
7. **Major Canon stays grounded** — do not invent binding major history, core relationships, powers, offices or world facts as new Canon without support.
8. **Natural handoff** — stop at a genuine reaction/decision branch; do not manufacture natural-language menus.

## Architecture constraints

Preserve the AI-first architecture:

`System = Facts -> User = New PC Intent -> One AI Writer = Scene Composition`

Do not reintroduce merely to control prose:

- Event Director / Event Engine
- Schedule Engine
- NPC selector score
- cast rotation scheduler
- hook/attention/event-density meters
- prose quotas
- Korean semantic-regex narrative control
- extra planning model calls

## Canon correction discovered during acceptance

Human testing exposed a presentation-data omission for Serena: her white hair was not supplied to the Writer, so RAW generation filled the blank incorrectly. `presentation.json` now explicitly supplies Serena = `백발`, with regression coverage.

Lesson: when an already-fixed Canon fact is missing from Writer material, repair the factual base rather than restricting the Writer's general inference freedom.

## Current known limitation

RAW output intentionally does not ask the Writer to emit structured continuity. The current wrapper therefore freezes date/time/location/situation continuity in RAW mode.

This is **not** a reason to return to structured Writer output. The next runtime problem is to restore durable continuity/state persistence while preserving the accepted COMPACT / RAW Writer behavior and one-call narrative architecture.
