# Canon Source Audit — AI-First Base

This document records source provenance and conflicts discovered while auditing the Pure-V0 Canon base. It is documentation only and is not Writer runtime context.

## Authority order used by this audit

1. Explicit current project Canon / human decision
2. Latest explicit legacy Canon source fact that has not been superseded
3. Earlier Canon source fact
4. Reference-play observation, used for portrayal/quality evidence but not silently promoted over conflicting Canon
5. Inference — never stored as fact without an explicit decision

## Confirmed source / reference conflicts

### Academy directional layout

Latest legacy Canon v7 explicitly states:

- main-building west: knight department
- main-building east: magic department
- theology beyond the magic side at the lakeside
- great library behind the main building
- dorms A/B/C and student facilities at the rear lakeside

One reference-play log instead described the central plaza with knight facilities to the east and magic facilities to the west.

Decision: **keep the explicit Canon layout**. The reference log is a qualitative narrative benchmark and can contain generated spatial drift.

### Dorm hall assignment

Legacy Canon / the reference opening both contain an older rule that first-years use A hall. The current project Canon explicitly supersedes that rule:

- A/B/C are student residence halls
- a year or department is not globally locked to one hall
- an individual's assignment belongs to dated/run state

Decision: **current project override wins**. `academy.json`, `geography.json`, and the dated scenario were reconciled accordingly.

This override must remain documented so a future migration does not "repair" the data back to the superseded A=first-year mapping.

## Presentation audit

The old text Canon explicitly confirms that the first 14 detailed academy characters are women. The Aria fact section also explicitly confirms Aria as a woman.

The reference opening additionally supports stable visible facts for the main opening cast:

- Emily — silver hair, blue eyes, small build; formal entrance-ceremony presentation includes white dress + principal cloak
- Lena — silver hair, purple eyes, small build, loosely worn magic-department robe
- Artemis — tied-back white hair, red eyes, military-like professor uniform, real sword at waist
- Sera — brown hair, blue eyes, plain knight-department presentation without ornate noble decoration; worn/practical equipment
- Lillia — red hair, gold eyes, longsword, Valenhardt-marked scabbard

These are stored in `data/canon/characters/presentation.json`.

Presentation facts for other characters remain unasserted until a text/asset/source audit supports them. Image filenames or genre expectation are not evidence by themselves.

## Character-core fidelity findings

The initial Cleanroom correctly removed dated state from durable character identity, but some semantic rewrites also weakened or replaced source characterization.

Example: Elena.

Legacy Canon describes her as:

- free-spirited
- playful
- hedonistic
- curiosity-first
- more interested in magical truth than power

The first Cleanroom character core leaned much more heavily on `reason / principle / hypothesis / basics`, which is useful portrayal interpretation but does not preserve the full source personality by itself.

General rule for future character-content work:

- preserve source personality/background/interest/strength/limitation first
- add source-supported portrayal refinement alongside it
- refinement must not replace the source trait with a safer generic archetype
- secrets/rumors/private knowledge must stay out of ordinary public packets and remain epistemically classified

CANON-BASE-01 completed this source-fidelity re-audit for the established detailed academy character cores. Remaining audit work concerns still-unverified presentation/capability facts and private-truth access classification; it is not permission to flatten source traits or infer missing facts.

## Relationship migration omissions found

The earlier Cleanroom relationship file omitted several source-backed dated relations. Restored in CANON-BASE-01:

- Isabel → Anastasia: competition / resistance
- Isabel → Sera: favorable interest / curiosity
- Sera → Isabel: guarded
- Elena → Lucia: distant-kin distance / non-intervention
- Elena → Serena: distant-kin distance / non-intervention

These are relationship facts, not mandatory scene choreography.

## Important reference-vs-fact distinction

Reference logs are allowed to support stable portrayal facts only when they do not conflict with higher-authority Canon/current project decisions. Reference-specific room numbers, exact scene order, exact NPC selection, prose, dialogue, or incidental geography are not automatically Canon.

## Factual retrieval boundary

CANON-BASE-01 already implements thin factual retrieval in `api/lib/canon-context.js`.

Character core, presentation, dated state, relationships, and group attitudes supplied for portrayal/continuity remain **system facts**. Their presence in a scene packet does not make them PC knowledge, NPC-to-NPC knowledge, or mandatory narration. PC-facing facts remain separately selected through Knowledge Canon.

## Remaining source audit

After CANON-BASE-01, remaining work is:

1. audit the characters still listed as unverified in `presentation.json` for source-backed visible facts and any durable capabilities not yet migrated
2. classify omitted private capabilities/secrets into Knowledge Canon instead of exposing them through ordinary character packets
3. audit current-character state completeness without inventing missing ages/locations
4. keep unresolved details explicitly unknown and preserve the existing factual retrieval boundary rather than replacing it with guessed data