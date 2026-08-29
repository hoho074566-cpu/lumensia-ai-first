# Canon Migration Audit

Source: `hoho074566-cpu/lumencia-ac` legacy main Canon bundle and related data.

This audit records significant clean-room transformations. It is documentation only and is not Writer runtime context.

## Global changes

### MIGRATION_CHANGE — split Canon by authority type

Legacy Canon mixed permanent facts, dated current state, knowledge visibility, NPC speech, old conflict-resolution notes, PC system rules, a draft PC, and GM/runtime instructions.

AI-First separates:

1. immutable world Canon
2. character core/voice Canon
3. epistemic knowledge Canon
4. dated scenario baseline
5. mutable run state

### DROP — legacy narrative instructions

GM RULES, GM STYLE, Director policy, Scene/Turn policy, prompt instructions, context-routing policy, and prose quotas are not Canon and were not migrated into the new Canon data.

### DROP — Aaa test character

`Aaa TEST CHARACTER — MERCENARY V1` was explicitly marked DRAFT in the source and was not migrated. New PCs are run-specific user-created state.

## Power-system reconciliation

### MIGRATION_CHANGE — Etera / 9-circle history

Legacy older text stated that there had been no recorded 9-circle mage in the empire for roughly a century. Later authoritative NPC material explicitly established Etera as a living 9-circle mage and marked the old statement obsolete.

Cleanroom keeps only the current fact: Etera is a living 9-circle mage. Public knowledge about that fact is separately restricted in Knowledge Canon.

### MIGRATION_CHANGE — Anastasia realm

An older summary described Anastasia as near-Master. Later detailed material explicitly resolved her current official realm as **Master (entry)**.

Cleanroom baseline uses Master (entry).

### CLEAN — Expert High / Expert Peak

The source later clarifies the qualitative distinction:

- Expert High: externalized aura / sword-energy use
- Expert Peak: aura shaping and precise simultaneous internal/external control
- Master: aura blade and will/concept carried through aura, without automatically making it an Authority

The initial `power-system.json` keeps Expert Peak conservative where the old compact source was still incomplete. This detail is flagged for a later power-system expansion rather than silently overfitting prose into runtime rules.

## Emily epistemic split

### SOURCE_FACT

- Emily is the academy principal.
- Her true upper limit is not publicly known.
- Public active-mage statistics identify Elena as the widely known active 8-circle mage.

### KNOWLEDGE_FACT

Restricted records classify Emily at least around mature Master + 8-circle composite capability, while even peers do not confidently know her actual ceiling.

### MIGRATION_CHANGE

Legacy text sometimes placed `실제 경지 불명` beside the restricted composite estimate. Cleanroom does not force these into one public sentence. `actual upper limit unknown` remains character truth; the composite estimate is a restricted knowledge fact.

## Character core vs dated state

Age, academy year, current office, current realm/circle, current relationships, current goal, and current location were frequently embedded directly inside old NPC profiles.

Cleanroom moves changeable values to `baseline_1285_03_01` or scenario files where practical.

Examples:

- Lillia is not eternally "a first-year"; she is a first-year on 1285-03-01.
- Anastasia's student-council presidency is a dated office, not eternal identity.
- Etera's current circle and Carne's current office are baseline state even though their deeper identity/background is durable.

## Refined characterization

The following refinements intentionally convert source traits into more playable semantic character descriptions. They do **not** create mandatory scene behavior.

### Lillia

SOURCE:
- bright, enthusiastic, straightforward
- loves fair competition
- sword-oriented noble knight
- strong body/aura and Lionheart sword style

REFINED:
- unfamiliar strength or sword technique tends to activate curiosity before hostility
- when actually fighting, the observant/adaptive swordswoman side can become more prominent than her everyday brightness

Basis: source Canon/Speech plus observed reference duel behavior.

### Sera

SOURCE:
- cynical, practical, sharp-edged
- survival/results oriented

REFINED:
- aid does not automatically create trust; she considers motive, class/social context, and concrete result
- when convinced by action she can lower her guard in indirect, practical ways rather than suddenly becoming warm

Basis: source Canon/Speech plus observed reference dorm interaction.

### Lena

SOURCE:
- sleepy, low-energy genius
- strong curiosity toward magic

REFINED:
- status and extraordinary achievement may be treated as surprisingly unimportant by her
- low energy is not low awareness; genuine magical anomaly or curiosity can make her attention abruptly sharp

Basis: source Canon/Speech plus observed reference freshman-representative scene.

### Emily

SOURCE:
- playful, free, observant, protective principal
- extraordinary but concealed power

REFINED:
- she does not need to perform authority constantly; casual humor and immense presence can coexist
- seriousness is effective through contrast with her normal lightness rather than louder speech

Basis: source Canon/Speech plus observed reference entrance ceremony.

## Knowledge / secrecy migration

Legacy global LEVEL 1–5 lists are retained conceptually but converted into fact-level metadata.

Important examples:

- Emily restricted composite-power record — visibility 4
- Etera being 9-circle — visibility 4
- Aria unconscious-oracle institutional record — visibility 4
- Apostle/Archbishop exact powers and weaknesses — visibility 5
- Lily's actual intent — visibility 5 / unresolved
- Carne–Ridel exact contract cost — visibility 5

### Lena / Sloth / Etera successor project

The legacy source contains a substantial Level-5 successor/ascension secret. It has **not** been placed in ordinary Lena/Sloth/Etera character packets.

It is stored as visibility-5 Knowledge Canon, including:

- `Lena` as Etera's private successor title
- Sloth as the first successor
- current Lena's artificial magical origin
- current Lena not knowing her artificial origin or Sloth predecessor
- Lena and Sloth not being ordinary siblings/clones/split fragments
- Etera's memory intervention
- unresolved duplicate-successor legitimacy
- the ascension project's real purpose

This prevents the Writer from casually leaking the twist merely because the system knows it.

## Rumor vs fact cleanup

The clean-room model avoids upgrading rumors into truth.

Examples:

- Seriel being an ancient pure-blood elf remains rumor unless/until the Level-5 truth is separately established.
- Emily surviving since the first emperor remains rumor.
- Chloe's information dealing may exist as reputation/rumor where the source frames it that way.
- Orpheum investigation suspicion is not automatic proof that Aris is guilty.

## Starting-state migration

The following are not immutable Canon and were moved to the dated `academy-1285-03-01` scenario:

- 1285-03-01 Monday
- 08:40 at the academy great-hall front
- entrance ceremony today
- department orientation around noon
- freshman evaluation next week
- regular classes beginning in the third week
- student organizations scouting new talent
- current succession situation
- Gray Wolf Forest issue
- restricted Silent Expansion / Prima Glacie / Orpheum situations

The scenario is a state snapshot, **not a Writer event queue**.

## Assets

The clean-room asset manifest preserves the 32 canonical character keys and 13 portrait expressions from the legacy V2 character asset manifest, while dropping legacy alias keys and old PNG paths.

## Not yet migrated into runtime

The following are deliberately postponed until V0 narrative quality passes:

- relationship mutation engine
- memory engine
- faction reputation runtime
- skill-learning runtime
- awakening/talent runtime
- Event/Schedule runtime
- Fate/Ending/Inheritance runtime
- off-screen progression runtime

Their source implementations are not assumed to be portable.
