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

Adds ordinary background motion around:

- training-space competition and informal sparring interest
- lab/research/resource competition
- class/cultural difference without making class war the default
- student-organization cooperation and soft rivalry
- free-time conversation, gossip, money, equipment, exams, romance, family and outside missions
- small personal friction such as group work, invitations, noise and broken promises
- social presence: nearby people may listen, keep doing their own work, or leave when their reason to stay ends

These are background Canon, not an event table or encounter scheduler.

## Current living characterization

`data/scenarios/academy-1285-03-01/character-state.json`

Current academy-life portrayal notes now cover the ordinary academy-living cast rather than only the initial high-frequency cluster.

First cluster:
- Artemis
- Lillia
- Sera
- Emily
- Elena
- Isabel
- Anastasia

Broadened cast signals:
- Lucia — student-council / White Rose work, research competitiveness, public/private contrast
- Sia — gardens/spirits/sensory curiosity without naive mystery generation
- Lena — quiet spaces and sudden focus around genuinely interesting magic
- Laris — independent precision training rather than orbiting Lillia all day
- Mirabelle — theology life plus natural interest in knight training
- Serena — library/lab life and confidence when discussing magic structure
- Chloe — cross-department materials/information activity without turning every relationship into a sale
- Aria — guest/saint duties plus ordinary quiet time and personal conversation
- Elise — White Rose logistics, social networking and independent schedule

This layer gives Writer more plausible reasons to use the wider cast. It is not a rotation directive and does not penalize recently used characters.

### Artemis target

Artemis is not a terse tutorial bot.

Target reading:

- she dislikes unnecessary words, but gives complete practical explanations when useful;
- dry humor and veteran realism can appear in ordinary conversation;
- truly angry or personally wounded moments become markedly shorter, creating contrast;
- once high competence is actually demonstrated, she updates judgment rather than extending novice evaluation;
- with peer-level swordspeople she can speak as a swordswoman, not only as an instructor;
- she can admit a mistaken first judgment without inventing another test to save face.

## NPC-to-NPC living relationships

`data/scenarios/academy-1285-03-01/relationships.json`

Adds or deepens ordinary ties such as:

- Lillia ↔ Sera
- Artemis ↔ Sera
- Artemis ↔ Emily
- Anastasia ↔ Isabel sister familiarity beneath political rivalry
- Elena's current attitude toward Serena's self-directed magic interest

These relationships are background facts, not forced cameos or required dialogue pairs.

## Procedure / restatement compression

The existing runtime PC-premise principle was refined rather than adding a separate questionnaire system.

- strong/unusual PC facts still do not automatically escalate investigation;
- if the answer is already present in PC settings, a valid document, or current facts, the player should not be made to repeat it through serial Q&A;
- routine procedure compresses to its result once its purpose is satisfied;
- only uncertainty that can actually change danger, conflict, permission, or another important result should remain a live scene focus;
- no question counters, stages, quotas, or deterministic interrogation machinery are introduced.

## Read-only NPC appearance diagnostic

`INFO` now shows **NPC APPEARANCE DIAGNOSTIC** using up to the latest 50 saved turns.

It counts turns in which registered Named NPCs appear or are mentioned using saved scene text/speaker/presence facts. This is a diagnostic thermometer, not a cast controller.

The frequency data:

- is computed locally from saved history;
- is not persisted as narrative state;
- is not sent to Writer;
- is not sent to State Keeper;
- does not boost, suppress, rotate, or cooldown any character.

It exists so human testing can distinguish a real cast-frequency skew from subjective impression.

## Protected boundaries

CANON-LIVING-01 does not add:

- Event Engine / Director / scheduler
- NPC selector / cast rotation / cooldown / quotas
- frequency feedback into Writer
- emotion score
- automatic threat escalation
- forced daily event list
- extra narrative model calls

The accepted Golden3 Writer prompt template is unchanged.

## Human gate

Use fresh-save ordinary play and look for:

1. Artemis sounds like a veteran human rather than a military chatbot.
2. Lillia visibly enjoys strong swordplay without becoming a one-note duel addict.
3. Sera remains dry but does not comment on every nearby exchange.
4. Emily's light/serious contrast remains strong.
5. Elena looks genuinely delighted by interesting magic rather than clinically analyzing everything.
6. Anastasia/Isabel feel like sisters as well as political rivals.
7. Lucia/Sia/Lena/Laris/Mirabelle/Serena/Chloe/Aria/Elise have plausible independent daily-life entry points.
8. NPCs interact naturally with one another without needing PC initiation.
9. Same four characters do not dominate simply because previous turns contained them.
10. Nearby NPCs may stay silent or leave when they have no reason to participate.
11. PC settings already supplied are not turned into repeated procedural questions.
12. Quiet academy scenes contain ordinary life but do not manufacture drama just to stay busy.
13. Small friction stays small when nothing warrants escalation.
14. NPC frequency diagnostic remains read-only and never affects generation.
15. Golden3 prose quality, PC authority, continuity, growth and relationship behavior remain intact.

`STATUS: DRAFT / HUMAN QUALITATIVE GATE`
