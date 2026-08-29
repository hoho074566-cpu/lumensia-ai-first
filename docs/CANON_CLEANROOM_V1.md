# Canon Cleanroom V1

Legacy Canon mixed immutable setting, dated current state, knowledge access, voice instructions, patch history, test-PC material, and GM/runtime rules. The AI-first Canon separates them.

## Layers

### 1. Immutable World Canon

World laws, institutions, history, geography, economy, magic/power rules, and durable organizational facts.

### 2. Character Core Canon

Identity, durable background, personality, values, enduring aspirations, combat identity, and character-specific secrets.

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

### 4. Dated Scenario Baseline

Values true at a particular starting date but expected to change during play: age-at-date, school year, realm, current office, relationships, current goal, current location, political situation, and scheduled facts.

### 5. Mutable Run State

Everything actually changed by play.

## Character refinement policy

Source facts are preserved unless a documented conflict is resolved. Characterization may be rewritten into more playable semantic language when the rewrite is supported by existing Canon/Speech and/or observed reference behavior.

Example:

- source: `밝고 활기찬 반말 / 정정당당한 경쟁 선호`
- refined: `강한 상대나 낯선 검술을 만나면 경계보다 호기심이 먼저 움직이는 편이며, 검을 잡으면 평소보다 관찰과 적응이 두드러진다.`

The refinement describes how existing traits cohere; it must not invent new biography, powers, relationships, or mandatory story behavior.

## Runtime retrieval rule

The Writer does not receive the full Cleanroom. The runtime selects only currently relevant facts and character packets.

`KNOW != MENTION`

`CONSTRAINT != CONTENT`

`STATE != STORY BEAT`
