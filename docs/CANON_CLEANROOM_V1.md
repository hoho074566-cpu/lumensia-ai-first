# Canon Cleanroom V1

Legacy Canon mixed immutable setting, dated current state, knowledge access, voice instructions, patch history, test-PC material, and GM/runtime rules. The AI-first Canon separates them.

## Layers

### 1. Immutable World Canon

World laws, institutions, history, geography, economy, magic/power rules, and durable organizational facts.

Current political snapshots, current office holders, current school years, and individual residence assignments do not belong here.

### 2. Character Core Canon

Durable identity, durable background, personality, values, enduring aspirations, combat identity, voice, and source-supported characterization.

Character core does **not** carry current age-at-date, academy year, current office, current realm/circle, current location, or current relationship.

### 3. Knowledge Canon

Facts are represented with epistemic metadata instead of assuming that truth equals character knowledge.

Typical fields:

```json
{
  "id": "...",
  "subject": "...",
  "fact": "...",
  "truth_status": "confirmed | rumor | assessment | unknown",
  "visibility": 1,
  "public": true
}
```

Restricted truth must not be duplicated into an ordinary public character/scenario packet merely because the system knows it.

### 4. Dated Scenario State

Values true at a particular starting date but expected to change during play.

For `academy-1285-03-01` this layer is split by meaning:

- `baseline.json` — start date/time/location, academic period, housing policy, institutional and political snapshot
- `character-state.json` — current year/department/office/realm/circle/presence where established
- `relationships.json` — person → person dated stances
- `group-attitudes.json` — person → group default attitudes that do not create individual relationships
- `open-situations.json` — unresolved world situations only; not schedules or generic political background

### 5. Mutable Run State

Everything actually changed by play.

Run state supersedes dated scenario state after play changes a fact.

## Character refinement policy

Source facts are preserved unless a documented conflict is resolved. Characterization may be rewritten into more playable semantic language when the rewrite is supported by existing Canon/Speech and/or observed reference behavior.

Example:

- source: `밝고 활기찬 반말 / 정정당당한 경쟁 선호`
- refined: `강한 상대나 낯선 검술을 만나면 경계보다 호기심이 먼저 움직이는 편이며, 검을 잡으면 평소보다 관찰과 적응이 두드러진다.`

The refinement describes how existing traits cohere; it must not invent new biography, powers, relationships, mandatory story behavior, or hidden knowledge.

## Runtime retrieval rule

The Writer does not receive the full Cleanroom. Runtime selects only currently relevant facts and character packets.

A file existing in Canon does not mean its whole contents should be included every turn.

`KNOW != MENTION`

`CONSTRAINT != CONTENT`

`STATE != STORY BEAT`

`SYSTEM TRUTH != NPC KNOWLEDGE`
