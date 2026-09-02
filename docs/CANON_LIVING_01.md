# CANON-LIVING-01 — Living World / Character Pass

## Goal

Make Lumensia feel inhabited during ordinary play without solving quietness by forcing attacks, mysteries, or scripted events.

The intended feel is:

- PC가 아무것도 하지 않아도 학생과 교수는 자기 수업·훈련·연구·사교·약속·문제로 움직인다.
- 작은 생활 마찰과 소문이 존재하지만 자동으로 범죄·음모·대형사건이 되지 않는다.
- Named NPC는 PC를 위한 기능이 아니라 서로 이미 알고 지내는 사람들이다.
- 캐릭터의 감정 온도와 행동은 서로 다르며, 건조함/절제와 감정 없음은 구분한다.

## Scope of first pass

### Academy living culture

`data/canon/world/academy.json`

Adds ordinary background motion around:

- training-space competition and informal sparring interest
- lab/research/resource competition
- class/cultural difference without making class war the default
- student-organization cooperation and soft rivalry
- free-time conversation, gossip, money, equipment, exams, romance, family and outside missions
- small personal friction such as group work, invitations, noise and broken promises

These are background Canon, not an event table.

### Current living characterization

`data/scenarios/academy-1285-03-01/character-state.json`

The first pass adds current academy-life portrayal notes for:

- Artemis
- Lillia
- Sera
- Emily
- Elena
- Isabel
- Anastasia

This is deliberately a small current-scenario layer before rewriting durable character cores. Human Preview should verify that the notes improve portrayal without overfitting. If accepted, durable core wording can later be reconciled where appropriate.

#### Artemis target

Artemis is not a terse tutorial bot.

Target reading:

- she dislikes unnecessary words, but gives complete practical explanations when they are useful;
- dry humor and veteran realism can appear in ordinary conversation;
- truly angry or personally wounded moments become markedly shorter, creating contrast;
- once high competence is actually demonstrated, she updates her judgment rather than extending novice evaluation;
- with peer-level swordspeople she can speak as a swordswoman, not only as an instructor;
- she can admit a mistaken first judgment without inventing another test to save face.

### NPC-to-NPC living relationships

`data/scenarios/academy-1285-03-01/relationships.json`

Adds or deepens ordinary ties such as:

- Lillia ↔ Sera
- Artemis ↔ Sera
- Artemis ↔ Emily
- Anastasia ↔ Isabel sister familiarity beneath political rivalry
- Elena's current attitude toward Serena's self-directed magic interest

These relationships are background facts, not forced cameos or required dialogue pairs.

## Protected boundaries

CANON-LIVING-01 does not add:

- Event Engine / Director / scheduler
- NPC selector / cast rotation / quotas
- emotion score
- automatic threat escalation
- forced daily event list
- extra narrative model calls

The accepted Golden3 Writer prompt template is unchanged.

## Human gate

Use fresh-save ordinary play and look for:

1. Artemis sounds like a veteran human rather than a military chatbot.
2. Lillia visibly enjoys strong swordplay without becoming a one-note duel addict.
3. Sera remains dry but shows emotion through behavior and practical choices.
4. Emily's light/serious contrast remains strong.
5. Elena looks genuinely delighted by interesting magic rather than clinically analyzing everything.
6. Anastasia/Isabel feel like sisters as well as political rivals.
7. NPCs interact naturally with one another without needing PC initiation.
8. Quiet academy scenes contain ordinary life but do not manufacture drama just to stay busy.
9. Small friction stays small when nothing warrants escalation.
10. Golden3 prose quality, PC authority, continuity, growth and relationship behavior remain intact.

`STATUS: DRAFT / HUMAN QUALITATIVE GATE`
