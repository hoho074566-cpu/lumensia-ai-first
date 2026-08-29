# Lumensia AI-First Repository Rules

These rules apply to the entire repository.

## Product priority

Narrative quality is the primary product requirement.

- **SYSTEM = facts and integrity**
- **USER = new PC intent**
- **AI = scene composition and world/NPC initiative**

The model writes scenes. Deterministic code must not attempt to reproduce semantic narrative judgment through large rule systems.

## Clean-room rule

`hoho074566-cpu/lumencia-ac` is a legacy source repository only.

Do not copy, import, cherry-pick, or reconstruct the legacy narrative runtime. In particular, do not port legacy:

- context router / prompt stack
- GM rules / GM style runtime directives
- Scene Momentum / Scene Exit / Scene Purpose / Scene Orchestration
- Turn Hook / Reaction Field / Suggested Actions pressure
- Event Progress as prose choreography
- participant queues / generic actor routing
- adaptive-time or time-plan narrative engines
- NPC significance / rotation / goal-tick narrative control
- regex-based Korean semantic classifiers
- prose scoring / paragraph or dialogue quotas

If a legacy module contains useful data or a hard-integrity concept, extract the concept and reimplement it minimally instead of importing the module.

## V0 scope

Until V0 human narrative acceptance passes, prefer only:

- clean Canon data
- clean character core + voice data
- current scene/run state
- exact USER ACTION
- relevant context selection
- one AI Writer call
- minimal hard validation
- minimal persistence/rendering

Do not add Event Engine, Schedule Engine, Ending/Fate/Inheritance runtime, NPC simulation, complex progression, or automatic Suggested Actions before V0 narrative acceptance.

## Writer boundary

The Writer may naturally elaborate execution of an action the player already chose and may advance NPCs, time, environment, and the current scene when no new meaningful PC decision is required.

The Writer must not invent a new PC goal, meaningful voluntary decision, voluntary dialogue, or explicit emotional choice.

Player autonomy does not mean world inactivity.

## Canon boundary

Keep these layers distinct:

1. immutable world canon
2. character core canon
3. knowledge/visibility facts
4. dated scenario baseline
5. mutable run state

A dated value such as a school year, current realm, office, relationship, current goal, or current location is not immutable character identity merely because it was written in an old NPC profile.

## Reference policy

Reference play logs are qualitative benchmarks only.

Never put raw reference prose, reference scene order, reference-specific NPC selection, or quoted reference dialogue into the production Writer prompt. Reference material teaches quality, not what must happen.

## Hard validation only

Deterministic validation may enforce hard constraints such as:

- PC identity
- registered character/asset keys
- malformed output
- impossible canonical commitments
- forbidden invented PC decisions/dialogue
- save/data integrity
- stale async result rejection
- security/auth boundaries

Do not reject or rewrite output because of preferred prose rhythm, dialogue count, reaction count, scene-depth targets, subtext, sensory quotas, or stylistic regex matches.

## Change safety

- Keep changes small and inspectable.
- Add tests for hard invariants, not narrative taste.
- Never place secrets or API keys in the repository.
- Use `store: false` for model calls unless explicitly changed for a reason.
- Preserve one canonical Writer model call per normal turn during V0.
- Do not merge changes that have not passed the current human narrative gate when the task affects Writer behavior.
