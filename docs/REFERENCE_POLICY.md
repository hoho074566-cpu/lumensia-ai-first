# Reference Policy

The original play logs are development-only qualitative benchmarks.

## Allowed use

Humans and QA tooling may use the references to judge whether AI-First Lumensia produces the same **kind of narrative quality**, including:

- a short player input expanding into a meaningful scene
- NPC/world initiative without constant player commands
- narration, dialogue, action, and reaction interleaving naturally
- routine time compression
- meaningful moments receiving enough space
- distinctive Named Characters occupying scenes as people rather than functions
- NPC-vs-NPC interaction
- combat evolving exchange by exchange
- mystery preserving knowledge boundaries
- failure producing a new story state rather than simply undoing the scene
- quiet relationship scenes remaining readable through character and subtext

## Forbidden production use

Production runtime must not:

- import reference files
- paste raw reference prose into the Writer prompt
- use reference dialogue as few-shot production content
- hardcode reference scene order
- hardcode `ceremony => Emily`, `dorm => Sera`, `training => Lillia`, or similar reference-derived character choreography
- treat reference-invented abilities, prices, relationships, or state mistakes as Canon

The reference teaches **how well a scene should work**, not **what must happen**.

## Acceptance principle

Automated safety tests cannot declare narrative quality PASS.

For V0, same-type generated scenes should be placed next to the references and judged by a human. The target is not textual imitation; the target is that both sides plainly read as living serialized-fantasy scenes.

`A little better` is not sufficient for the core narrative gate.
