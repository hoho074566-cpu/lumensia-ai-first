# CANON-LIVING-01 — Living World / Character Pass

## Goal

Make Lumensia feel inhabited during ordinary play without solving quietness by forcing attacks, mysteries, scripted events, or deterministic cast rotation.

The intended feel is:

- PC가 아무것도 하지 않아도 학생과 교수는 자기 수업·훈련·연구·사교·약속·문제로 움직인다.
- 작은 생활 마찰과 소문이 존재하지만 자동으로 범죄·음모·대형사건이 되지 않는다.
- Named NPC는 PC를 위한 기능이 아니라 서로 이미 알고 지내는 사람들이다.
- 캐릭터의 감정 온도와 행동은 서로 다르며, 건조함/절제와 감정 없음은 구분한다.
- 같은 공간에 있는 NPC가 매 대화 비트마다 코멘트를 붙이는 관객 합창단이 되지 않는다.
- 이미 PC 설정·문서에 있는 사실을 플레이어가 절차상 다시 구술하느라 턴을 소비하지 않는다.

## Academy living culture

`data/canon/world/academy.json`

Adds ordinary background motion around training/research/resource competition, class/cultural difference, student-organization cooperation and soft rivalry, free-time conversation, imperfect rumors, small personal friction, and social presence.

These are background Canon, not an event table or encounter scheduler.

## Current living characterization

`data/scenarios/academy-1285-03-01/character-state.json`

Current academy-life portrayal notes cover all 16 ordinary academy-living Named NPCs:

- Anastasia
- Isabel
- Lucia
- Elena
- Artemis
- Sera
- Sia
- Lillia
- Lena
- Emily
- Laris
- Mirabelle
- Serena
- Chloe
- Aria
- Elise

This layer gives Writer plausible ordinary reasons to use the wider cast. It is not a rotation directive and does not penalize recently used characters.

## Compact character depth pass

Every ordinary academy-living Named NPC has exactly **two** `depth_notes` axes.

The purpose is not to add secret-tragedy twists or longer personality manuals. Each pair gives Writer a compact contradiction / alternate face so characters can behave in surprising-but-believable ways depending on context.

Examples:

- Anastasia — ambition mixed with duty; flawless public control versus private fatigue and ordinary-life blind spots.
- Isabel — freedom versus wanting recognition independent of her sister; playful defiance versus sudden imperial decisiveness when choice is genuinely threatened.
- Lucia — meritocratic self-image versus inherited hierarchy; harshness toward Serena partly tangled with the belief that she herself endured the same pressure.
- Elena — curiosity versus ethical limits; playful researcher versus immediate practical seriousness when safety becomes real.
- Artemis — rules/basic form versus battlefield pragmatism; protecting students versus deliberately allowing useful failure.
- Sera — self-interest/survival versus willingly taking a loss for someone she has accepted as her own; money as safety and choice rather than noble aspiration.
- Sia — fascination with human society versus fear of losing her forest/spirit roots; bright curiosity versus stubbornness on matters she directly understands through spirits.
- Lillia — chivalric fair-play ideals versus the reality that ugly tactics can save lives; admiration for strength can coexist with envy or anxiety without becoming spite.
- Lena — low-energy indifference versus obsessive focus/responsibility when something truly matters; quiet attachment can erase the sleepy mask.
- Emily — respecting student freedom versus using authority to stop a choice when protection genuinely requires it; playfulness does not erase private responsibility.
- Laris — wanting to defeat Lillia without wanting her ruined; restrained rivalry versus a soft spot for precise recognition of his own work.
- Mirabelle — resistance to religious formality versus sincere faith; teasing versus direct solidarity when someone exposes genuine fear or conviction.
- Serena — social timidity versus stubborn confidence in her own magical judgment; trusted private company can reveal dry wit and firmness.
- Chloe — calculating value versus placing exceptional value on earned trust; soft negotiation face versus direct anger when trust is broken.
- Aria — saintly symbolic duty versus wanting ordinary personhood; gentleness versus a firm boundary when faith or goodwill is used to consume people.
- Elise — social/information calculation versus real loyalty to her network; polished public composure versus private fatigue and competitiveness.

`depth_notes` are writer-facing depth axes, not mandatory beats. They are not required to appear every scene, are not twist triggers, and do not force any character to behave against current evidence or relationship state.

### Artemis target

Artemis is not a terse tutorial bot. She dislikes unnecessary words but gives useful complete explanations; dry humor and veteran realism can appear; true anger becomes markedly shorter; proven high competence updates her judgment; and peer-level swordspeople can be treated as fellow swordspeople rather than permanent students.

## NPC-to-NPC living relationships

`data/scenarios/academy-1285-03-01/relationships.json`

Adds/deepens ordinary ties such as Lillia ↔ Sera, Artemis ↔ Sera, Artemis ↔ Emily, Anastasia ↔ Isabel sister familiarity, and Elena's current attitude toward Serena's self-directed magic interest.

These relationships are background facts, not forced cameos or required dialogue pairs.

## Procedure / restatement compression

The existing runtime PC-premise principle was refined rather than adding a separate questionnaire system.

- strong/unusual PC facts do not automatically escalate investigation;
- if the answer is already present in PC settings, a valid document, or current facts, the player should not be made to repeat it through serial Q&A;
- routine procedure compresses to its result once its purpose is satisfied;
- only uncertainty that can actually change danger, conflict, permission, or another important result should remain live;
- no question counters, stages, quotas, or deterministic interrogation machinery are introduced.

## Read-only NPC appearance diagnostic

`INFO` shows **NPC APPEARANCE DIAGNOSTIC** using up to the latest 50 saved turns.

The frequency data is computed locally, is not persisted as narrative state, is not sent to Writer or State Keeper, and cannot boost/suppress/rotate/cooldown any character.

## Protected boundaries

CANON-LIVING-01 adds no Event Engine / Director / scheduler, NPC selector / rotation / cooldown / quotas, frequency feedback into Writer, emotion score, automatic threat escalation, forced daily event list, extra narrative model call, or mandatory character-conflict/twist machinery.

The accepted Golden3 Writer prompt template is unchanged.

## Validation

Exact head: `c1b787d485219c3a943a60b1b701efe70a0ebb76`

- GitHub Actions run #445: **PASS**
- Vercel exact-head: **PASS**
- Golden3 / Canon / runtime / UI / growth / relationship / continuity / health audit: PASS
- broadened cast / procedure compression / NPC frequency diagnostic: PASS
- compact two-axis Character Depth regression gate: PASS

## Human gate

Use fresh-save ordinary play and look for:

1. Artemis sounds like a veteran human rather than a military chatbot.
2. Lillia visibly enjoys strong swordplay without becoming a one-note duel addict.
3. Sera remains dry but does not comment on every nearby exchange.
4. Emily/Elena retain character-specific emotional contrast.
5. Anastasia/Isabel feel like sisters as well as political rivals.
6. the broader cast has plausible independent daily-life entry points.
7. characters can show a different but believable face when values conflict, without depth notes becoming repeated gimmicks.
8. NPCs interact naturally without PC initiation.
9. same four characters do not dominate merely because previous turns contained them.
10. nearby NPCs may stay silent or leave when they have no reason to participate.
11. supplied PC settings are not turned into repeated procedural questions.
12. quiet academy scenes contain ordinary life without manufacturing drama.
13. small friction stays small when nothing warrants escalation.
14. NPC frequency diagnostic remains read-only.
15. Golden3 prose quality, PC authority, continuity, growth and relationship behavior remain intact.

`STATUS: DRAFT / HUMAN QUALITATIVE GATE`
