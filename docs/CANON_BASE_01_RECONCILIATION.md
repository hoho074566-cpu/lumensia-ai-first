# CANON-BASE-01 — Clean Canon Reconciliation

Base: exact Pure V0 `876e235918c99f4588c9ef4eb874ecee4541be97`

This pass is deliberately **not** a Writer-quality patch. It reconciles the facts, provenance, epistemic boundaries, and factual retrieval that the Writer will eventually consume. The production Writer prose contract remains unchanged from Pure V0.

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

The older legacy A=first-year rule is explicitly superseded by current project Canon and documented in `CANON_SOURCE_AUDIT.md` so later migration work does not accidentally restore it.

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

Source-backed relationship rows omitted by the first Cleanroom were restored, including Isabel↔Sera, Isabel→Anastasia, and Elena→Lucia/Serena.

### 7. Durable character core separated from dated character state

`characters.json` now contains durable identity / background / personality / aspiration / combat identity / capabilities / strengths / limitations / voice / source-supported characterization.

Removed from durable character core:

- `baseline_1285_03_01`
- current age/year/office/realm/circle blocks
- migration/source-detail metadata

New `character-state.json` contains dated academy membership, year/department, current office, current realm/circle where appropriate, and academy/external presence classification.

Restricted Etera power is referenced through Knowledge Canon rather than copied into ordinary public dated state.

### 8. Source-fidelity character pass

The first Cleanroom had sometimes replaced source personality with a safer semantic rewrite. The academy cast was re-audited against source Canon so refinement supplements rather than erases the original characterization.

Examples restored/protected:

- Elena — free-spirited / playful / hedonistic / curiosity-first alongside her analytical research mind
- Artemis — source background, old chipped greatsword, practical shortest-path combat, true-knight aspiration
- Sera — cynical/practical survivalist axis and stable-life aspiration
- Sia — Spirit Affinity and established spirit-role distinctions
- Lillia — fair-competition axis plus source limitations in practical experience, deception response, and aura control under excitement
- Lena — extreme low-energy/laziness contrast plus Mana's Beloved
- Emily — playful/sharp contrast, with an explicit voice guard against converting `possibility / choice / responsibility` into repetitive thematic sermons
- Laris, Mirabelle, Serena, Chloe — source-backed strengths, limitations, interests, and activity axes restored

Source-confirmed facts whose information-access level is not yet audited are kept out of ordinary public knowledge and recorded as `access_unclassified` in `uncertainties.json`.

### 9. Presentation Canon added without guessing

New `characters/presentation.json` stores only source-audited visible facts.

Opening-benchmark characters now have stable presentation anchors where the source/reference supports them:

- Emily — female, silver hair, blue eyes, small build
- Lena — female, silver hair, purple eyes, small build, loose magic robe
- Artemis — female, tied white hair, red eyes, military-like professor wear, real sword
- Sera — female, brown hair, blue eyes, plain/practical knight presentation
- Lillia — female, red hair, gold eyes, longsword, Valenhardt-marked scabbard

Gender is source-confirmed for the detailed academy cast and Aria. Characters without audited presentation remain explicitly unverified rather than being filled from name/genre expectation.

### 10. Runtime Canon data cleaned of migration commentary

Removed development/migration notes from `power-system.json`, `pc.json`, and `academic-calendar.json` where those notes were not world facts.

Migration history remains documentation, not model-facing Canon.

### 11. Martial-realm Canon reconciled

Later source clarification already documented by the migration audit is now reflected in actual runtime Canon:

- Expert High — stable externalized aura / sword-energy use
- Expert Peak — aura shaping plus precise simultaneous internal/external aura control
- Master — aura blade / non-contact slash and will/concept carried through aura; Master itself is **not** automatically an Authority

### 12. PC creation contract aligned with the base UI/state path

The Canon already allowed:

- Traits
- Authorities
- starting gold
- a free character profile

The temporary Pure UI/server previously dropped those fields. The base form, local save, and server sanitizer now preserve them instead of shrinking Canon freedom to match a prototype UI.

### 13. Relevance-based factual Canon retrieval added

New `api/lib/canon-context.js` is a factual retrieval boundary, not a narrative selector.

It now provides:

- academy cast discovered from dated `presence`, rather than a hand-picked everyday-cast name list
- thin current-state / presentation / source-character signals for academy-resident Canon characters
- detailed packets only for mentioned/current/recently involved characters
- source-backed dated relationship hints and group attitudes
- location-relevant academy geography instead of omitting geography entirely
- society facts only when the current action actually references the relevant institutional topic
- public Knowledge only for selected subjects instead of dumping all level-1 facts when no character is relevant
- Open Situations only when the current action explicitly reaches one of those situations
- schedule facts only when imminent or explicitly queried

A 09:15 dorm/training turn therefore does **not** receive the distant 12:00 orientation simply because the schedule exists.

Schedule rows carry an explicit `state-not-event` semantic: `09:00` does not itself create nine bell strikes, an announcement, waiting prose, or any other fictional beat.

The Writer contract itself was not changed in this Canon/base PR.

### 14. Cross-file and retrieval hard-invariant tests added

Automated checks now reject:

- year-exclusive A/B/C dorm regression
- dated academy office state in immutable academy Canon
- current succession snapshot in immutable society Canon
- Etera 9-circle leakage through ordinary dated state
- schedule/political facts leaking back into Open Situations
- group pseudo-targets inside person relationship rows
- migration metadata returning to runtime Canon
- dated/source metadata returning to durable character core
- opening presentation anchors disappearing
- key source-character traits being flattened away again
- external/high-tier characters entering the ordinary academy cast solely because their Canon key exists
- unrelated public Knowledge flooding ordinary turns
- distant noon orientation entering an ordinary 09:15 dorm/training packet
- unrelated Open Situations entering ordinary school turns
- missing geography/relationship facts when they are actually relevant

## Remaining gaps after CANON-BASE-01

### A. Remaining presentation audit

Presentation is intentionally incomplete for characters whose appearance has not yet been source-audited. This is no longer a blocker for the opening benchmark because its principal cast has audited anchors, but the remaining characters should be completed before their visual identity becomes important in normal play.

### B. Information-access audit for several confirmed private truths

`uncertainties.json` currently holds source-confirmed truths with `access_unclassified` status, including examples around Laris, Serena, Chloe, Elise, and a Sera rumor.

Do not invent visibility numbers or `known_by` sets until source evidence supports them.

### C. Character-state completeness

`character-state.json` covers the established dated state needed for the academy opening. Missing ages, exact current locations, or other dated details remain absent rather than invented.

### D. Residence room-number assignment

Canon establishes A/B/C halls and single-room baseline, but the exact floor/room-number topology has not been source-audited. The base client therefore does not invent a deterministic room number merely to fill a field.

### E. Unknown Canon remains unknown

`uncertainties.json` remains authoritative for intentionally unresolved facts. Future cleanup must not convert an incomplete setting into a definitive answer merely for convenience.

## Gate before narrative work resumes

The Canon/base structural gate is satisfied when CI remains green on the exact PR head. Before the next Original-Feel Writer experiment, review this PR as the new factual base and keep any remaining unaudited details explicitly unknown.

Narrative acceptance is **not** implied by this Canon/base pass.
