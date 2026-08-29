# Legacy Asset Inventory

Reviewed source: `hoho074566-cpu/lumencia-ac` legacy main.

This inventory records non-Canon migration decisions so future work does not have to rediscover them.

| Legacy asset | Decision | AI-First treatment |
| --- | --- | --- |
| `assets.js` | KEEP / CLEAN COPY | Rebuilt as `assets/manifest.js`; 32 canonical keys, 13 portraits, fullbody URLs. |
| `index.html` | DESIGN REFERENCE | Do not copy. Rebuild V0 UI; preserve useful mobile interaction ideas only. |
| `styles.css` | DESIGN REFERENCE | Dark/gold visual DNA, readable narration/dialogue cards, mobile composer may inspire new CSS. Do not carry choice/debug/Fate-era CSS wholesale. |
| `manifest.webmanifest` | KEEP CONCEPT | Rebuilt minimal manifest without old runtime/icon assumptions. |
| `sw.js` | LATER REWRITE | Old cache list hardcodes old runtime/Fate/Event files. Create a new worker only after V0 file paths stabilize. |
| `.gitignore` | KEEP | Generic entries copied. |
| `.env.example` | KEEP CONCEPT | Rebuilt with one Writer model and server-only API key. |
| `vercel.json` | KEEP CONCEPT | Security headers retained; old app architecture not retained. |
| `api/health.js` | LATER REWRITE | Useful idea, but old endpoint advertises every legacy engine and router. New health endpoint should only report new runtime facts. |
| `package.json` | CLEAN REWRITE | Minimal Node 22 package created. Old OpenAI/Zod dependencies are not added until V0 code actually needs them. |
| `app.js` | NO | Contains old schedule, participant, save, Director, Fate, and runtime authority. |
| `app-runtime.js` | NO | Contains AUTO/CONTINUE/choices and stabilization logic tied to the old Turn architecture. |
| `api/chat.js` | NO | Giant inlined Canon + GM/prompt/schema/state-delta architecture. Source facts only were extracted. |
| `api/chat-router.js` | NO | Cross-couples Context Router, Scene/Time/Event/NPC/Growth systems and model-facing directives. |
| `api/lib/schema.js` | NO | Old model output combines fiction with large bookkeeping/state-delta payload. |
| `api/lib/utils.js` | NO / IDEA ONLY | Some hard sanitization ideas are useful, but file is tied to old Turn/relationship/growth/schedule schema. Rebuild only hard validators later. |
| `api/lib/memory.js` | NO CODE / LATER DATA IDEA | Useful fact/importance/knowledge/source/credibility semantics; old routing also injects schedules, NPC next activity and queues. |
| `save-migrations.js` | LATER LEGACY IMPORT ONLY | Specific `lilia -> lillia` migration is not new-runtime logic. Use only if legacy-save import becomes a product requirement. |
| `lib/run-commit-boundary.js` | LATER REIMPLEMENT | Valuable stale-run/epoch + journal/rollback concept; rewrite generically after V0 instead of copying Fate-coupled code. |
| `lib/fate-start.js` | LATER PRODUCT IDEA | Procedural-origin content is useful but not V0. Do not copy generated route/procedure assumptions. |
| `lib/fate-background.js` | CONCEPT ONLY | PUBLIC/LIMITED/PRIVATE/SECRET influenced Cleanroom Knowledge. Starting-route/evaluation choreography is rejected. |
| `lib/fate-personal-story.js` | NO RUNTIME | Dormant hook materialization is narrative routing. Origin-thread ideas may return only after V0. |
| `lib/fate-ending.js` | LATER LEDGER AUDIT | Ending registry/first-discovery ledger has deterministic value, but prompt contract must not be copied. |
| `lib/fate-inheritance.js` | LATER LEDGER AUDIT | Receipt/integrity/spent<=earned ideas may be reused after fresh audit. |
| `lib/faction-social-consequence.js` | LATER LEDGER DESIGN | Evidence types and bounded reputation are useful; not part of V0. |
| `lib/novel-presentation.js` | UI IDEA ONLY | Presentation de-duplication may inspire renderer work, but old scene/event assumptions are not imported. |
| `lib/debug-regression.js` / `dev-qa-test.html` | QA IDEA ONLY | Sandbox/clone-save QA is useful; tests themselves are coupled to old event/choice/runtime assumptions. |
| `scripts/qa/live-play-acceptance.mjs` | QA CASE IDEA ONLY | Reuse human scenario categories, not old `scene_momentum`, hook, schedule-boundary expectations. |
| old deterministic narrative tests | NO | They protect old architecture. New tests protect hard facts/integrity only. |
| old PR safety workflow | REWRITE | Replaced by tiny clean-room check. |
| Auto-PR / maintenance / merge-readiness tooling | ARCHIVE ONLY | Leave in legacy repo until new repo has a mature architecture worth automating. |
| `AGENTS.md` | NO | Explicitly commanded Codex to preserve old runtime architecture. Replaced from scratch. |
| old handover/progress docs | ARCHIVE ONLY | Historical evidence, not new-project instructions. |

## Rule of thumb

If a legacy asset answers **"what is true?"**, **"what data must survive?"**, or **"how do we keep data secure?"**, it may contain reusable value.

If it answers **"what should the next scene do?"**, **"who should speak next?"**, **"when should this turn stop?"**, or reconstructs prose meaning through deterministic classifiers, it stays quarantined.
