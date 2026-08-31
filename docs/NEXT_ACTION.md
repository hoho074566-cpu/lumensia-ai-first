# Next Action

## NEW CHAT ENTRYPOINT

This repository has already gone through a full greenfield restart and several failed isolated Original-Feel experiments.

**Do not reconstruct that history from old chat messages.**

The current conversation is being retired because its accumulated context has become noticeably slow. A new session must begin by reading:

1. `docs/LUMENSIA_HANDOVER_CURRENT.md`
2. `docs/CANON_BASE_01_RECONCILIATION.md`
3. `docs/CANON_SOURCE_AUDIT.md`
4. `docs/ARCHITECTURE.md`
5. this file

Then refetch actual GitHub state.

---

## Current active work

**CANON-BASE-01 — Clean Canon Reconciliation**

- Repository: `hoho074566-cpu/lumensia-ai-first`
- PR: #19
- Branch: `codex/canon-base-01-clean-reconciliation`
- Base: exact Pure V0 `876e235918c99f4588c9ef4eb874ecee4541be97`
- Draft / unmerged
- Narrative Writer prose contract was intentionally not tuned in this pass.

The factual/base layer was audited after repeated narrative experiments showed that the Writer was receiving contradictory and asymmetric world data.

CANON-BASE-01 now includes:

- reconciled A/B/C residence Canon
- durable character core separated from dated character state
- source-fidelity restoration for flattened character traits
- source-audited presentation facts with unknowns left unknown
- secrecy/Knowledge leakage correction
- person relationships separated from group attitudes
- restored omitted source-backed relationships
- cleaned Open Situations
- reconciled special-crime jurisdiction
- reconciled Expert High / Expert Peak / Master definitions
- PC creation base fields preserved by UI/save/server
- bounded factual retrieval via `api/lib/canon-context.js`
- regression tests for cross-file Canon and factual retrieval

See the handover for the complete reasoning/history.

---

## Exact next action

1. Start in a **new chat/session**.
2. Read `docs/LUMENSIA_HANDOVER_CURRENT.md` first.
3. Refetch PR #19 exact current HEAD, base/merge-base, draft/mergeable status, CI and Vercel.
4. Do not reopen PR #15/#16/#17/#18 and do not reanalyze their outputs; their lessons are already recorded in the handover.
5. If PR #19 has a factual/base defect, fix only that defect and rerun the structural gates.
6. Do **not** infer narrative PASS from green structural tests.
7. Do **not** resume Original-Feel Writer tuning until the user accepts the Canon base.
8. Do not merge PR #19 automatically unless the user explicitly directs that action.
9. After Canon-base acceptance/merge, create a fresh narrative experiment branch from the accepted Canon-base commit. Do not stack prompt patches on old failed branches.
10. The first narrative probe should be cheap and unsteered: ordinary opening / residence / broad exploration / training-ground actions, without explicitly naming the desired Canon NPC.

---

## Hard constraints that remain

Do not introduce:

- Event Director / Event Engine
- Schedule Engine
- NPC goal tick / NPC selector score
- hook/attention/event-density meters
- cast rotation scheduler
- prose quotas
- Korean semantic regex narrative engines
- extra AI calls merely to decide the next beat

Keep the architecture:

`System = Facts -> User = New PC Intent -> One AI Writer = Scene Composition`

`HANDOFF_READY: PASS`

`NEXT_ACTION: NEW CHAT -> read LUMENSIA_HANDOVER_CURRENT.md -> refetch PR #19 -> finish/accept Canon-base before new Writer experimentation.`
