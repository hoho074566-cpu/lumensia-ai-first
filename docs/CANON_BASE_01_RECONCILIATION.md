# CANON-BASE-01 — Clean Canon Reconciliation

Base: exact Pure V0 `876e235918c99f4588c9ef4eb874ecee4541be97`

This pass is deliberately **not** a Writer-quality patch. It reconciles the facts and layer boundaries that the Writer will eventually consume.

## Fixed in this pass

### 1. Dorm Canon contradiction

Previous data contradicted itself:

- `academy.json`: year-separated A/B/C dorm wording
- `geography.json`: explicit `A=1학년, B=2학년, C=3학년`
- current project Canon: A/B/C are student residence halls and a specific year/department is not globally locked to one hall

Reconciled rule:

- A동/B동/C동 all exist as student residence halls
- halls are not immutable year-exclusive or department-exclusive buildings
- individual assignment is dated/run state
- baseline student rooms are single occupancy

### 2. Dated academy state removed from immutable academy Canon

Current principal / senior professors / student-council offices / White Rose offices moved to dated Scenario state.

### 3. Current imperial succession moved out of immutable society law

The succession **system** remains immutable world Canon.
The fact that Augustus III has not yet named a successor on 1285-03-01 is dated political state.

### 4. Special-crime jurisdiction reconciled

For imperial national-security cases involving major magic crime, forbidden magic/books, or demon-cult/Abyss activity:

- Imperial Security Bureau + imperial direct-response / guard forces are the principal imperial authorities
- Magic Tower inspectors, inquisitors, academy specialists, and divine specialists may assist according to subject matter

This avoids treating a specialist institution as the sole imperial authority.

### 5. Open Situations narrowed to actual unresolved situations

Removed from `open-situations.json`:

- entrance/orientation schedule
- freshman evaluation schedule
- imperial succession baseline
- early-term organization scouting
- Aria's academy stay

Those facts belong to calendar/scenario/world/dated-character state, not to a story-event bucket.

Remaining open situations are unresolved world situations such as Gray Wolf Forest, Silent Expansion, missing researchers, and Orpheum disappearances.

### 6. Person relationships separated from group attitudes

`relationships.json` now contains person → person dated stances only.

Group-facing defaults such as:

- Artemis → knight first-years
- Emily → academy members

live in `group-attitudes.json` and do not automatically create an individual relationship.

### 7. Durable character core separated from dated character state

`characters.json` now contains durable identity / background / personality / values / aspiration / combat identity / voice / source-supported characterization only.

Removed from durable character core:

- `baseline_1285_03_01`
- current age/year/office/realm/circle blocks
- migration/source-detail metadata

New `character-state.json` contains dated academy membership, year/department, current office, current realm/circle where appropriate, and academy/external presence classification.

Restricted Etera power is referenced through Knowledge Canon rather than copied into ordinary public dated state.

### 8. Runtime Canon data cleaned of migration commentary

Removed development/migration notes from `power-system.json`, `pc.json`, and `academic-calendar.json` where those notes were not world facts.

Migration history remains documentation, not model-facing Canon.

### 9. Cross-file hard-invariant tests added

`scripts/canon-base-01.test.mjs` now rejects:

- year-exclusive A/B/C dorm regression
- dated academy office state in immutable academy Canon
- current succession snapshot in immutable society Canon
- Etera 9-circle leakage through ordinary dated state
- schedule/political facts leaking back into Open Situations
- group pseudo-targets inside person relationship rows
- migration metadata returning to runtime Canon
- dated/source metadata returning to durable character core

## Intentionally NOT solved yet

These are Canon/base follow-ups, not reasons to resume Writer tuning.

### A. 32-character presentation facts

The asset registry has all 32 characters, but text Canon does not yet have a complete, source-audited presentation layer for every character (gender/presentation, hair/eye colors, stable signature clothing/equipment where genuinely canonical).

Do **not** invent missing presentation facts from names or genre expectations.
A later Canon pass should mine existing character assets / authoritative source material and record only supported facts.

### B. PC creation contract vs current UI

`pc.json` allows fields such as Traits, Authorities, starting gold, and a free character profile, while the current Pure V0 UI does not expose all of them.

This is a real base-contract mismatch. Resolve it before declaring PC creation complete, but do not silently delete supported PC freedom from Canon just to match the temporary UI.

### C. Runtime Canon retrieval coverage

Pure V0 currently imports only a subset of Canon files. Geography, society, cosmology, academic calendar, dated relationships/group attitudes, uncertainties, and PC rules are not all represented in the ordinary Writer packet.

Do not solve this by dumping every file into every turn.
After Canon is clean, design **relevance-based factual retrieval** with `KNOW != MENTION` and `STATE != STORY BEAT` preserved.

### D. Character-state completeness / provenance

The new `character-state.json` covers the currently established dated state needed for the academy start. Any missing ages, offices, locations, or presentation details must remain absent until supported by source.

### E. Unknown Canon must remain unknown

`uncertainties.json` remains authoritative for intentionally unresolved facts. Future cleanup must not convert an incomplete setting into a definitive answer merely for convenience.

## Gate before narrative work resumes

Do not start another Original-Feel Writer experiment until:

1. CANON-BASE-01 hard invariants are green.
2. Presentation/state gaps needed for the opening benchmark are explicitly resolved or marked unknown.
3. PC creation contract mismatch is resolved.
4. A thin retrieval design is chosen so the Writer receives relevant facts without schedule/background flooding.

Only then return to narrative acceptance.
