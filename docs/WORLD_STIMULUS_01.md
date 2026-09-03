# WORLD-STIMULUS-01 — Pressure / Opportunity / Social Heat

## Goal

Give the Golden3 Writer enough live world material to produce excitement without turning Lumensia into an event scheduler, random encounter table, or constant-attack game.

The target is not `more danger every N turns`.

The target is a wider range of believable stimulus:

- danger
- mystery
- scarce opportunity
- social heat / competition
- character-specific initiative through existing Canon
- aftermath through LIVING-CONSEQUENCE-01

## Stack

Base: `codex/living-consequence-01` / PR #44.

WORLD-STIMULUS is intentionally separate so human testing can distinguish:

- CANON-LIVING / Character Depth behavior
- Living Consequence persistence
- World stimulus / excitement changes

## 1. Open situations are now real Writer input

`data/scenarios/academy-1285-03-01/open-situations.json` already contained unresolved world problems, but the Writer runtime did not import the file.

`api/lib/authoring-runtime.js` now imports the source and includes it as:

`[OPEN WORLD STIMULI — AUTHORIAL FACTS, NOT EVENT QUEUE]`

in both COMPACT and FULL knowledge packets.

This is authorial knowledge, not automatic PC/NPC knowledge.

## 2. Stimulus types

`open-situations.json` v3 distinguishes four kinds:

### danger

Actual ongoing risk or harm potential.

Examples:
- twin-head wolf increase in Gray Wolf Forest
- hidden Abyss expansion
- restricted missing-team / disappearance situations

### mystery

Unresolved oddities without a pre-decided villain or escalation.

Examples:
- spirits avoiding one section of Wisdom Forest
- intermittent protection-ward instability in a shared magic lab

### opportunity

Scarce opportunities that are not PC-exclusive quests.

Examples:
- supervised cross-year sparring opening
- one short-term magic research-assistant opening

Other students may want or take these opportunities if the PC is uninterested. This is social competition, not a deadline processor.

### social_heat

Noncombat tension driven by people, status, pride, organizations, family, and reputation.

Examples:
- a student honor-duel dispute approaching formal mediation
- a Caldwin academic-funding delegation creating student-council / White Rose / family pressure

## 3. Calm is contrast, not world shutdown

`data/canon/world/academy.json` v4 adds a balance principle:

- quiet daily life remains valid;
- small friction still does not auto-escalate into conspiracy or attack;
- but real ongoing problems, opportunities, competition, and social tension may move through the world when the current place/people/information path naturally connects to them;
- unrelated drama is not injected merely to make a scene exciting.

This is deliberately semantic rather than a temperature counter.

## 4. Opportunity culture

Scarce opportunities such as good sparring partners, research roles, external-practice openings, rare materials, recommendations, scholarships, and invitations belong to the world rather than the PC.

This allows `I want that before someone else gets it` tension without a quest timer.

No opportunity scheduler or expiry engine exists.

## 5. Social heat

Public competition, team selection, recognition, research results, invitations, organizational influence, jealousy, and pride can raise scene intensity without combat.

The boundary remains:

- actual relationships/interests must support the tension;
- not every conflict becomes violence;
- not every interaction becomes romance or politics.

## 6. Authorial truth vs NPC knowledge

A recurring gameplay defect showed an NPC speaking as if she knew a specific PC combat habit the PC had not demonstrated.

Academy Canon now explicitly separates Writer knowledge from character knowledge:

- Writer may know the full PC sheet and nonpublic Canon;
- an NPC may treat a specific PC technique, habit, or past act as known only when it was directly observed, told, publicly established, or naturally transmitted;
- an NPC may still make a tentative inference from visible equipment or behavior;
- that inference must not be phrased as memory or confirmed knowledge.

No per-NPC knowledge matrix or deterministic knowledge engine is added.

## 7. Cast diversity strategy

WORLD-STIMULUS does not rotate the cast.

Instead, different situations give different characters genuine reasons to matter:

- spirit anomaly → Sia
- magic-lab instability / research opening → Elena, Lena, Serena
- sparring / duel tension → Laris, Artemis, Mirabelle, Lillia where relevant
- student mediation / organization pressure → Anastasia, Lucia, Elise
- family/delegation pressure → Lucia, Serena, Anastasia, Elise
- materials / information spillover → Chloe where naturally relevant

This should broaden actual appearance through relevance rather than quotas.

## Protected architecture

WORLD-STIMULUS-01 adds no:

- Event Engine / Director
- scheduler
- random encounter table
- pressure counter
- scene-temperature score
- cast rotation / cooldown / quota
- NPC selector
- deterministic rumor propagation
- deterministic knowledge graph
- extra Writer call
- extra State Keeper call

Accepted Golden3 `prompt_template` remains unchanged.

## Context budget

Exact push validation packet:

- Chat-Parity compact matrix: `38,765 chars`
- WORLD-STIMULUS gameplay-style compact packet: `38,433 chars`
- WORLD-STIMULUS regression hard ceiling: `< 50,000 chars`

The stimulus sourcebook therefore stays inside the current compact-context budget rather than creating a large new prompt layer.

## Validation

Push run #460:

- clean-room PASS
- V0 PASS
- Canon base / retrieval PASS
- Chat-Parity PASS
- Golden3 Writer PASS
- UI / PC status PASS
- Growth / Relationship PASS
- Continuity / Living Consequence PASS
- PC pressure / premise / procedural compression PASS
- Writer context balance PASS
- runtime health audit PASS
- CANON-LIVING / Character Depth PASS
- NPC frequency diagnostic PASS
- WORLD-STIMULUS-01 PASS

## Human gameplay gate

Use a fresh save and watch for:

1. ordinary life can still be calm without becoming sleepy for long stretches;
2. ongoing world situations can become visible through natural people/places/information paths;
3. opportunities can matter even when they are not dangerous;
4. other characters may pursue opportunities without waiting for the PC;
5. social tension can create excitement without defaulting to combat;
6. mysteries do not instantly become Abyss/cult/conspiracy stories;
7. existing secret pressures do not leak as universal public knowledge;
8. NPCs do not know unobserved PC techniques as facts;
9. different stimulus types naturally broaden the Named NPC cast;
10. Lillia/Sera/Artemis/Emily do not dominate merely from recent context;
11. Living Consequence still remembers real promises/rumors/aftermath without forced callbacks;
12. no random-event / quest-log / timer / scheduler feeling appears;
13. Golden3 prose quality and PC authority remain strong.

`STATUS: DRAFT / HUMAN QUALITATIVE GATE`
