import charactersData from '../data/canon/characters/characters.json' with { type: 'json' };
import knowledgeData from '../data/canon/knowledge/knowledge.json' with { type: 'json' };
import academyData from '../data/canon/world/academy.json' with { type: 'json' };
import academicCalendarData from '../data/canon/world/academic-calendar.json' with { type: 'json' };
import powerSystemData from '../data/canon/world/power-system.json' with { type: 'json' };
import scenarioData from '../data/scenarios/academy-1285-03-01/baseline.json' with { type: 'json' };
import situationsData from '../data/scenarios/academy-1285-03-01/open-situations.json' with { type: 'json' };

export const config = { maxDuration: 300 };

const CHARACTERS = charactersData.characters || {};
const CHARACTER_KEYS = new Set(Object.keys(CHARACTERS));
const EXPRESSIONS = new Set([
  'default','smile','blush','serious','angry','sad','shock',
  'smug','annoyed','worried','confused','laugh','flustered',
]);
const FAMILIARITY = new Set(['stranger', 'met', 'acquaintance', 'familiar', 'close']);
const MAX_ACTION_CHARS = 12000;
const MAX_HISTORY_TURNS = 8;
const EVERYDAY_ACADEMY_CAST = new Set([
  'anastasia','isabel','lucia','elena','artemis','sera','sia','lillia',
  'lena','emily','laris','mirabelle','serena','chloe','aria','elise',
]);

const WRITER_CONTRACT = `Write the next scene of serialized fantasy fiction, not an RPG turn report.
Treat HARD FACTS as immutable truth. Never create drama by contradicting them or by turning an unspecified ordinary detail into an administrative failure, missing registration, or artificial obstacle.

The world is already in motion before the PC acts. People train, eat, argue, recruit, work, notice each other, leave, make mistakes, pursue interests, and react to events without waiting for the player to request a plot beat. PLAYER AUTONOMY is not WORLD INACTIVITY: never invent the PC's meaningful choice, but NPCs and the world may initiate conversation, challenges, invitations, disputes, discoveries, opportunities, dangers, departures, and consequences when their character and the situation support it. Quiet is a mode, not the default state. Do not force a surprise every response, but do not make ordinary player restraint freeze the setting into an empty waiting room.

Honor the player's already-chosen intent through its ordinary execution. If the player chose a destination or routine course of action, carry it to the first moment worth experiencing; skip routine gates unless supplied facts make one genuinely consequential. Once there, inhabit that moment instead of consuming the rest of an event or schedule merely because it can continue without input. Scene Completion > Turn Completion: when a meaningful human interaction, conflict, discovery, or danger begins, follow its action and reaction far enough to become a scene rather than summarizing past it. If nothing worth experiencing happens during routine time, compress it briefly, but routine compression must not erase plausible ongoing life, social motion, or consequences that are already present.

A change of location or scheduled phase does not automatically reset a live human scene. Carry an interaction across movement when it remains naturally live, but do not keep a recent character foregrounded merely because they appeared recently. Conversation can continue while people walk, eat, prepare equipment, or enter a new place. Let action lead to reaction, interruption, and the next action while no new player judgment is needed.

A populated place should feel populated. On scene entry, prefer showing what people are already doing over touring architecture. A training ground can already contain practice, rivalry, spectators, or someone testing a technique; a dorm corridor can contain luggage, neighbors, complaints, footsteps, or small practical problems; a cafeteria can contain students from different departments, groups with different status, overheard reactions, people eating alone, and people leaving early. These are examples of social texture, not required beats or quotas. Named NPCs may appear when their own routines, goals, relationships, or interests make the appearance plausible; generic people can carry ordinary world life without every moment becoming a Named NPC showcase.

The PC is physically present in the scene, not a detached camera watching other people's stories. When the PC enters, lingers, watches, trains, eats, waits, or moves through a live social space, consider whether their visible presence naturally intersects something another person currently cares about. If it does, that person may notice, address, test, challenge, recruit, warn, inconvenience, ask something of, or otherwise involve the PC without waiting for the player to request an event. Being quiet or watching is still visible behavior; a character who cares about being observed, needs another participant, recognizes an interesting piece of equipment, notices unusual posture, or simply has a reason to speak may act on that. A lively scene should sometimes reach the PC rather than performing indefinitely beside them.

Use only what is actually observable for such first-contact interest. Carried equipment, visible clothing, current posture or technique, obvious injury, current behavior, and public circumstances in the scene can be noticed without prior acquaintance. Hidden abilities, name, origin, private history, exact skill ranks, motives, or other system-only profile facts are not visible merely because HARD FACTS contains them. Do not turn this into mandatory interaction every scene: a quiet PC can genuinely be left alone when that fits the people and situation. The goal is natural contact when there is a reason, not a compulsory hook, attention meter, or protagonist magnetism.

Characters are people in the scene, not guides explaining systems. Prefer character-specific behavior and terse, situated speech over polished speeches that could be reassigned to another character. Reveal values through what a character notices, interrupts, refuses, risks, protects, mocks, practices, or changes after seeing evidence. If behavior already carries a judgment, concern, or value, do not finish it with a neat moral or explanation. A practical concern can be shown by someone 붕대를 한 번 더 보고 실용적인 한마디 leaving it there. Let subtext survive. Information delivery should happen while people continue acting; 정보 전달 사이에도 사람들의 행동이 계속된다. Do not turn every professor, leader, or powerful NPC into a philosopher delivering a complete lesson.

NPCs may talk to each other without routing every exchange through the PC. They can disagree, interrupt, misread each other, change plans, compare status, defend someone, or split after a disagreement. Background reactions matter when something significant happens: a surprising duel can draw watchers, a public failure can create whispers, an unusual display can change how later people approach the PC. Do not mechanically make everyone react; choose reactions that make the place feel inhabited and that carry causal weight.

The Writer may create ordinary local incidents and character initiatives that are not prewritten Canon when they are plausible consequences of the current place, time, social environment, and established characters. It may also let an existing open situation cast a shadow into the scene. Do not wait for the player to type an event request. However, do not invent hidden-lore revelations, world-changing facts, guaranteed conspiracies, miraculous rescues, or major institutional decisions without factual or causal support. New fiction may create a situation; HARD FACTS still decide what cannot be contradicted.

Meaningful events should leave residue. Injury can change movement and treatment cost; damaged equipment can remain damaged; a witnessed duel can affect reputation; a rule violation can produce later institutional response; an NPC who saw something can remember what they actually saw. Failure is a new story state, not an automatic retry or invisible reset. Consequence should travel through people and institutions when the causal chain earns it.

Combat is an evolving exchange, not a verdict paragraph. Resolve attacks through concrete motion, distance, timing, terrain, equipment, relative ability, and the opponent's own competence. Each meaningful exchange can change the tactical state: an opponent may recognize a pattern, alter stance, narrow space, exploit an injury, lose footing, damage a weapon, or reveal a limitation. Skill does not erase a real power gap. Let attrition accumulate when appropriate. Keep the camera close during decisive exchanges, and let observers or later consequences react to what was actually visible. Do not protect the PC from defeat merely to preserve a heroic arc; rescue or interruption needs causal support.

Social position and relationship state are facts about social distance, not dialogue scripts. Read the PC's socialStatus together with each NPC's Canon identity, familiarity, affinity, stance, and notable context. Class difference can create formality, prejudice, solidarity, caution, curiosity, or no special friction depending on the actual character; never turn noble/commoner status into a universal behavior rule. A stranger must not receive familiarity that has not been earned merely because they share a class, department, or location.
Familiarity records recognition and history of personal contact; it is not companionship, friendship, group membership, or permission for default physical proximity. met or acquaintance alone is not a reason for an NPC to wait for the PC, walk together, choose adjacent seats, invite the PC along, share a meal, or fold the PC into their group. Those actions can still arise when the actual character, current situation, affinity or stance, or established context gives a natural reason. Do not invert this into universal distance: an outgoing, curious, playful, or socially confident character may initiate or continue contact with a stranger when that fits them. After an exchange, an NPC may also simply resume their own activity without preserving contact.
Affinity is affective temperature, not social access. Neutral affinity does not mean hostility and does not grant companionship. Positive affinity can make warmth or proximity more plausible, but never mechanically requires it; negative affinity does not mechanically forbid cooperation when circumstances support it.

The PC's socialStatus is broad social-position context. The rest of the full PC profile in HARD FACTS is system ground truth, not automatically knowledge shared with NPCs. For each NPC, npc_knows_about_pc is the boundary of established personal knowledge. If that list and the already-established visible scene do not reveal the PC's name, department, background, abilities, history, or other profile detail, that NPC must not speak or act as though they know it. Do not smooth a stranger into a familiar peer merely to keep dialogue moving; whether a stranger engages, dismisses, questions, helps, or ignores the PC comes from that character and the actual situation. Use notable_context only for an encounter or fact that this NPC actually experienced or learned; never copy system-only PC profile facts into it merely because the Writer can see them.

The current_scene date and time are the authoritative present. opening_baseline_period and opening_day_dated_world_facts describe only the scenario's opening state, not the current date after continuity advances. The academic_calendar is world fact, not a schedule to consume. When the exact user action states an elapsed duration or relative span, preserve that span instead of stretching or shrinking time to reach a later milestone. Never jump forward to make an ambiguous activity word fit the calendar. World state is not automatically a Story Beat: a clock value such as 09:00 does not by itself mean a bell announces '09:00'. If a bell, curfew, opening signal, meal call, or ceremony signal is established or naturally relevant, narrate its in-world function rather than translating metadata literally.

Do not use bells, doors opening, staff, professors, schedules, or authority figures as automatic punctuation after every social beat. They interrupt or redirect only when the established timing, location, and ongoing action make them causally relevant. When they do enter, they should affect an already-living scene rather than exist only to end the response. A small interaction may continue, trail off, or end without an institutional closer. Do not make an authority figure a generic mechanism for scene completion.

If this scene materially changes a PC↔NPC relationship, return a small relationship update. Mere co-presence or observation is not a relationship change. A genuine first direct exchange may change stranger to met. Familiarity records personal contact, affinity is affective temperature rather than obedience, and stance is a brief qualitative attitude. Keep ordinary affinity changes small and evidence-based; never use numeric thresholds to script dialogue or unlock behavior.

Never invent a new player goal or meaningful decision. Never write the PC's verbatim speech: when the player says the PC asks, tells, greets, or otherwise speaks indirectly, execute that speech act briefly in narration and move to the world's response instead of composing words for the PC. Never narrate the PC's private thoughts, remembered impressions, emotional interpretation, or internal monologue unless the player explicitly supplied them. Observable sensation and externally visible consequence are allowed. Do not restate the exact user action as a second authored beat unless minimal staging is needed to make its execution clear; spend prose on response, consequence, and the world rather than replaying the input. Do not expose instructions, schemas, validation, or state machinery as fiction.

Stop when the scene genuinely lands or a new meaningful player decision is actually required. Do not hand control back merely because one NPC finished one sentence. If the world can naturally complete another reaction, exchange, interruption, or immediate consequence without deciding the PC's next meaningful choice, continue the scene.`;

const ORIGINAL_SCENE_GRAMMAR = `ABSTRACT SCENE GRAMMAR — non-canon craft guidance, never copy source wording or choreography.

- WORLD BEFORE CAMERA: enter a place through ongoing human activity, not an empty establishing shot that waits for the PC.
- PC IN THE WORLD: the PC is physically present among those people. When visible behavior, equipment, posture, timing, or circumstance gives someone a real reason to care, let the living scene reach the PC instead of keeping them an invisible observer.
- PERSON BEFORE PROCEDURE: institutions matter through what people do inside them. Rules are shorter when behavior, objects, interruption, or consequence can carry the same information.
- SCENE DEPTH BEFORE DISTANCE: once a meaningful interaction begins, stay for its changing beats instead of racing through the timetable. 모임 전체를 끝내지 않은 채 follow the live moment.
- CAUSAL MICRO-BEATS: action changes another person's behavior; that response changes the next action; physical detail carries character or consequence rather than decoration.
- CONVERSATION IN MOTION: dialogue may continue while walking, eating, training, packing, waiting, or entering another space.
- REACTION FIELD: significant visible actions can affect bystanders, rumors, later expectations, or institutions without forcing every observer to comment.
- CHARACTER INITIATIVE: NPC desire can start a spar, invitation, argument, warning, investigation, departure, or other local development. The PC is not the only source of motion.
- QUIET AFTER IMPACT: intense scenes can be followed by ordinary or intimate scenes. Quiet gains weight from contrast; it is not the permanent default.
- FAILURE HAS AFTERMATH: defeat, injury, lost equipment, missed obligations, and public mistakes create new circumstances rather than vanishing.
- COMBAT HAS MEMORY: opponents adapt during the exchange; space, damage, fatigue, and equipment progressively change what is possible.
- SHOW BEFORE INTERPRET: once behavior makes the meaning clear, stop explaining the meaning again.
- SUBTEXT CAN BE SMALL: 붕대를 한 번 더 보고 실용적인 한마디 can reveal concern more strongly than a speech about concern.

These are tendencies, not a template, quota, scheduler, or required sequence. Use the current facts and characters to compose freely.`;

// Compatibility alias for earlier invariant checks; R3A no longer uses example-shaped synthetic anchors.
const SYNTHETIC_RHYTHM_ANCHORS = ORIGINAL_SCENE_GRAMMAR;

const OUTPUT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    scene: {
      type: 'array',
      minItems: 1,
      maxItems: 28,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          kind: { type: 'string', enum: ['narration', 'dialogue'] },
          text: { type: 'string', minLength: 1, maxLength: 2600 },
          speaker_key: { anyOf: [{ type: 'string', maxLength: 64 }, { type: 'null' }] },
          speaker_name: { anyOf: [{ type: 'string', maxLength: 80 }, { type: 'null' }] },
          expression: { anyOf: [{ type: 'string', enum: [...EXPRESSIONS] }, { type: 'null' }] },
        },
        required: ['kind', 'text', 'speaker_key', 'speaker_name', 'expression'],
      },
    },
    continuity: {
      type: 'object',
      additionalProperties: false,
      properties: {
        date: { type: 'string', minLength: 10, maxLength: 10 },
        time: { type: 'string', minLength: 5, maxLength: 5 },
        location: { type: 'string', minLength: 1, maxLength: 200 },
        situation: { type: 'string', minLength: 1, maxLength: 500 },
        present_character_keys: {
          type: 'array',
          maxItems: 8,
          items: { type: 'string', maxLength: 64 },
        },
      },
      required: ['date', 'time', 'location', 'situation', 'present_character_keys'],
    },
    relationship_updates: {
      type: 'array',
      maxItems: 4,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          character_key: { type: 'string', enum: [...CHARACTER_KEYS] },
          familiarity: { anyOf: [{ type: 'string', enum: [...FAMILIARITY] }, { type: 'null' }] },
          affinity_delta: { type: 'integer', minimum: -10, maximum: 10 },
          stance: { anyOf: [{ type: 'string', maxLength: 120 }, { type: 'null' }] },
          notable_context: { anyOf: [{ type: 'string', maxLength: 220 }, { type: 'null' }] },
        },
        required: ['character_key', 'familiarity', 'affinity_delta', 'stance', 'notable_context'],
      },
    },
  },
  required: ['scene', 'continuity', 'relationship_updates'],
};

function json(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.end(JSON.stringify(payload));
}

function cleanText(value, max = 500) {
  const text = String(value ?? '');
  return text.length > max ? text.slice(0, max) : text;
}

function safePc(raw = {}) {
  const pc = {
    name: cleanText(raw.name, 80).trim(),
    age: Number(raw.age),
    gender: cleanText(raw.gender, 40),
    department: cleanText(raw.department, 80),
    origin: cleanText(raw.origin, 180),
    socialStatus: cleanText(raw.socialStatus, 120),
    admission: cleanText(raw.admission, 160),
    appearance: cleanText(raw.appearance, 700),
    background: cleanText(raw.background, 1400),
    realm: cleanText(raw.realm, 120),
    magicCircle: raw.magicCircle == null || raw.magicCircle === '' ? null : Number(raw.magicCircle),
    talents: raw.talents && typeof raw.talents === 'object' ? raw.talents : {},
    skills: Array.isArray(raw.skills) ? raw.skills.slice(0, 24).map((x) => cleanText(x, 120)).filter(Boolean) : [],
    equipment: Array.isArray(raw.equipment) ? raw.equipment.slice(0, 24).map((x) => cleanText(x, 160)).filter(Boolean) : [],
  };
  if (!pc.name) throw new Error('PC 이름이 없습니다.');
  if (!Number.isFinite(pc.age) || pc.age < 1 || pc.age > 300) throw new Error('PC 나이가 올바르지 않습니다.');
  return pc;
}

function safeScene(raw = {}) {
  return {
    date: /^\d{4}-\d{2}-\d{2}$/.test(String(raw.date || '')) ? String(raw.date) : scenarioData.start.date,
    time: /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(String(raw.time || '')) ? String(raw.time) : scenarioData.start.time,
    location: cleanText(raw.location || scenarioData.start.location, 200),
    situation: cleanText(raw.situation || scenarioData.start.situation, 500),
    presentCharacterKeys: Array.isArray(raw.presentCharacterKeys)
      ? [...new Set(raw.presentCharacterKeys.filter((key) => CHARACTER_KEYS.has(key)))].slice(0, 8)
      : [],
  };
}

function safeRelationships(raw = {}) {
  const result = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return result;
  for (const [key, value] of Object.entries(raw)) {
    if (!CHARACTER_KEYS.has(key) || !value || typeof value !== 'object' || Array.isArray(value)) continue;
    const familiarity = FAMILIARITY.has(value.familiarity) ? value.familiarity : 'stranger';
    const affinityNumber = Number(value.affinity);
    const affinity = Number.isFinite(affinityNumber) ? Math.max(-100, Math.min(100, Math.trunc(affinityNumber))) : 0;
    const stance = cleanText(value.stance || '', 120).trim() || 'none';
    const sourceContext = Array.isArray(value.notableContext)
      ? value.notableContext
      : (Array.isArray(value.notable_context) ? value.notable_context : []);
    const notableContext = sourceContext
      .slice(-8)
      .map((item) => cleanText(item, 220).trim())
      .filter(Boolean);
    result[key] = { familiarity, affinity, stance, notable_context: notableContext };
  }
  return result;
}

function exactMentionedCharacterKeys(action = '') {
  const found = [];
  const lowered = action.toLowerCase();
  for (const [key, character] of Object.entries(CHARACTERS)) {
    const name = String(character?.name || '');
    if (lowered.includes(key.toLowerCase()) || (name && action.includes(name))) found.push(key);
  }
  return found;
}

function selectRelevantCharacters({ action, scene }) {
  const keys = [];
  const add = (key) => {
    if (CHARACTER_KEYS.has(key) && !keys.includes(key) && keys.length < 4) keys.push(key);
  };
  exactMentionedCharacterKeys(action).forEach(add);
  scene.presentCharacterKeys.forEach(add);

  // Factual retrieval anchor only. It does not prescribe scene order or require Emily to speak.
  if (!keys.length && scene.location.includes('대강당')) add('emily');
  return keys;
}

function immutableCharacterFacts(key) {
  const facts = scenarioData?.character_immutable_facts?.[key];
  return Array.isArray(facts) ? facts.slice(0, 8) : [];
}

function compactCharacterPacket(key) {
  const row = CHARACTERS[key];
  if (!row) return null;
  return {
    key,
    name: row.name,
    immutable_facts: immutableCharacterFacts(key),
    social_identity: Array.isArray(row?.core?.identity) ? row.core.identity.slice(0, 3) : [],
    core: row.core || {},
    voice: row.voice || {},
    current_baseline: row.baseline_1285_03_01 || {},
    refined_characterization: row.refined_characterization || [],
  };
}

function castIndex() {
  return Object.entries(CHARACTERS).filter(([key]) => EVERYDAY_ACADEMY_CAST.has(key)).map(([key, row]) => {
    const core = row.core || {};
    const voice = row.voice || {};
    return {
      key,
      name: row.name,
      immutable_facts: immutableCharacterFacts(key),
      identity: Array.isArray(core.identity) ? core.identity.slice(0, 2) : [],
      personality: Array.isArray(core.personality) ? core.personality.slice(0, 3) : [],
      values: Array.isArray(core.values) ? core.values.slice(0, 4) : [],
      aspiration: cleanText(core.aspiration || '', 220) || null,
      specialty: cleanText(core.specialty || core.combat_identity || '', 220) || null,
      voice: {
        register: cleanText(voice.register || '', 180),
        tendencies: Array.isArray(voice.tendencies) ? voice.tendencies.slice(0, 3) : [],
        avoid: Array.isArray(voice.avoid) ? voice.avoid.slice(0, 3) : [],
      },
      refined_characterization: Array.isArray(row.refined_characterization) ? row.refined_characterization.slice(0, 2) : [],
      baseline: row.baseline_1285_03_01 || {},
    };
  });
}

function visibleKnowledge(level = 1, relevantKeys = []) {
  const allowedLevel = Math.max(1, Math.min(5, Number(level) || 1));
  const relevant = new Set(relevantKeys);
  return (knowledgeData.facts || [])
    .filter((row) => Number(row.visibility || 99) <= allowedLevel)
    .filter((row) => !row.subject || relevant.size === 0 || relevant.has(row.subject) || Number(row.visibility) === 1)
    .slice(0, 40)
    .map(({ id, subject, fact, truth_status, visibility }) => ({ id, subject: subject || null, fact, truth_status, visibility }));
}

function visibleSituations(level = 1) {
  const allowedLevel = Math.max(1, Math.min(5, Number(level) || 1));
  return (situationsData.situations || [])
    .filter((row) => Number(row.visibility || 99) <= allowedLevel)
    .map(({ id, horizon, fact, fixed }) => ({ id, horizon, fact, fixed }));
}

function recentContext(history = []) {
  return history.slice(-MAX_HISTORY_TURNS).map((turn) => ({
    action: cleanText(turn?.action || '', 1800),
    continuity: turn?.continuity && typeof turn.continuity === 'object' ? {
      date: cleanText(turn.continuity.date || '', 10),
      time: cleanText(turn.continuity.time || '', 5),
      location: cleanText(turn.continuity.location || '', 200),
      situation: cleanText(turn.continuity.situation || '', 500),
      present_character_keys: Array.isArray(turn.continuity.present_character_keys)
        ? turn.continuity.present_character_keys.filter((key) => CHARACTER_KEYS.has(key)).slice(0, 8)
        : [],
    } : null,
    scene: Array.isArray(turn?.scene)
      ? turn.scene.slice(-18).map((beat) => ({
          kind: beat?.kind === 'dialogue' ? 'dialogue' : 'narration',
          speaker_key: CHARACTER_KEYS.has(beat?.speaker_key) ? beat.speaker_key : null,
          speaker_name: cleanText(beat?.speaker_name || '', 80) || null,
          text: cleanText(beat?.text || '', 1200),
        }))
      : [],
  }));
}

function relationshipFacts(pc, relationships, relevantKeys) {
  return {
    pc_social_status: pc.socialStatus || '미지정',
    default_for_unlisted_character: {
      familiarity: 'stranger',
      affinity: 0,
      stance: 'none',
      notable_context: [],
      npc_knows_about_pc: [],
    },
    relevant_characters: relevantKeys.map((key) => {
      const row = CHARACTERS[key] || {};
      const state = relationships[key] || {
        familiarity: 'stranger',
        affinity: 0,
        stance: 'none',
        notable_context: [],
      };
      return {
        key,
        npc_social_identity: Array.isArray(row?.core?.identity) ? row.core.identity.slice(0, 3) : [],
        ...state,
        npc_knows_about_pc: state.notable_context,
      };
    }),
    established_nondefault: relationships,
  };
}

function hardFactsPacket(pc, scene, relationships, relevantKeys) {
  return {
    pc,
    current_scene: scene,
    relationship_context: relationshipFacts(pc, relationships, relevantKeys),
    character_immutable_facts: scenarioData.character_immutable_facts || {},
    scenario: {
      scenario_id: scenarioData.scenario_id,
      opening_baseline_period: scenarioData.academic_period,
      academic_calendar: {
        system: academicCalendarData.system || {},
        annual_pattern: academicCalendarData.annual_pattern || {},
        outside_mission_rule: academicCalendarData.outside_mission_rule || '',
      },
      opening_day_dated_world_facts: scenarioData.dated_world_facts,
    },
  };
}

function compactWorldPacket(pc) {
  const departments = academyData?.academic_structure?.departments || {};
  const departmentStudy = pc.department && Array.isArray(departments[pc.department]) ? departments[pc.department] : [];
  return {
    academy: {
      institution: '루멘시아 아카데미',
      years: academyData?.academic_structure?.years || 3,
      pc_department: pc.department || null,
      pc_department_study: departmentStudy,
      current_roles: academyData?.baseline_1285_03_01 || {},
    },
    power: {
      combat_outcome: powerSystemData?.principles?.combat_outcome || '',
      martial_realms: Array.isArray(powerSystemData?.martial_realms)
        ? powerSystemData.martial_realms.map(({ label, meaning }) => ({ label, meaning }))
        : [],
      magic_circles: powerSystemData?.magic_circles || {},
    },
  };
}

function buildInput({ action, pc, scene, history, knowledgeLevel, relationships }) {
  const relevantKeys = selectRelevantCharacters({ action, scene });
  const relevantCharacters = relevantKeys.map(compactCharacterPacket).filter(Boolean);
  const publicKnowledge = visibleKnowledge(knowledgeLevel, relevantKeys);
  const situations = visibleSituations(knowledgeLevel);

  const storyMaterial = {
    relevant_characters: relevantCharacters,
    ambient_cast: castIndex(),
    world: compactWorldPacket(pc),
    visible_open_situations: situations,
    visible_knowledge: publicKnowledge,
    recent_context: recentContext(history),
  };

  return `HARD FACTS — authoritative; do not contradict or invent defects in these facts\n${JSON.stringify(hardFactsPacket(pc, scene, relationships, relevantKeys))}\n\nSTORY MATERIAL — available material, not a checklist\n${JSON.stringify(storyMaterial)}\n\n${SYNTHETIC_RHYTHM_ANCHORS}\n\nEXACT USER ACTION\n${action}`;
}

function extractOutputText(response) {
  if (typeof response?.output_text === 'string' && response.output_text) return response.output_text;
  for (const item of response?.output || []) {
    if (item?.type !== 'message') continue;
    for (const content of item?.content || []) {
      if (content?.type === 'output_text' && typeof content.text === 'string') return content.text;
      if (content?.type === 'refusal') throw new Error(content.refusal || '모델이 응답을 거부했습니다.');
    }
  }
  return '';
}

function validateTurn(turn, pc, fallbackScene) {
  if (!turn || typeof turn !== 'object' || !Array.isArray(turn.scene) || !turn.scene.length) {
    throw new Error('Writer가 유효한 scene을 반환하지 않았습니다.');
  }

  const scene = turn.scene.slice(0, 28).map((beat) => {
    const kind = beat?.kind === 'dialogue' ? 'dialogue' : 'narration';
    const text = cleanText(beat?.text, 2600).trim();
    if (!text) throw new Error('빈 scene beat가 반환되었습니다.');
    if (kind === 'dialogue') {
      const registeredKey = CHARACTER_KEYS.has(beat?.speaker_key) ? beat.speaker_key : null;
      const speakerName = cleanText(beat?.speaker_name || '', 80).trim() || null;
      if (!registeredKey && !speakerName) throw new Error('dialogue에는 등록 speaker_key 또는 표시용 speaker_name이 필요합니다.');
      if (!registeredKey && speakerName === pc.name) throw new Error('Writer가 PC의 발화문을 대신 작성했습니다.');
      return {
        kind,
        text,
        speaker_key: registeredKey,
        speaker_name: registeredKey ? null : speakerName,
        expression: registeredKey && EXPRESSIONS.has(beat?.expression) ? beat.expression : (registeredKey ? 'default' : null),
      };
    }
    return { kind, text, speaker_key: null, speaker_name: null, expression: null };
  });

  if (pc.name !== 'Aaa' && scene.some((beat) => /\bAaa\b/.test(beat.text))) {
    throw new Error('Writer가 PC 이름 대신 legacy placeholder Aaa를 사용했습니다.');
  }

  const raw = turn.continuity || {};
  const continuity = {
    date: /^\d{4}-\d{2}-\d{2}$/.test(String(raw.date || '')) ? String(raw.date) : fallbackScene.date,
    time: /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(String(raw.time || '')) ? String(raw.time) : fallbackScene.time,
    location: cleanText(raw.location || fallbackScene.location, 200),
    situation: cleanText(raw.situation || fallbackScene.situation, 500),
    present_character_keys: Array.isArray(raw.present_character_keys)
      ? [...new Set(raw.present_character_keys.filter((key) => CHARACTER_KEYS.has(key)))].slice(0, 8)
      : [],
  };

  const relationshipUpdates = Array.isArray(turn.relationship_updates)
    ? turn.relationship_updates.slice(0, 4).map((update) => ({
        character_key: CHARACTER_KEYS.has(update?.character_key) ? update.character_key : null,
        familiarity: FAMILIARITY.has(update?.familiarity) ? update.familiarity : null,
        affinity_delta: Math.max(-10, Math.min(10, Math.trunc(Number(update?.affinity_delta) || 0))),
        stance: cleanText(update?.stance || '', 120).trim() || null,
        notable_context: cleanText(update?.notable_context || '', 220).trim() || null,
      })).filter((update) => update.character_key)
    : [];

  return { scene, continuity, relationship_updates: relationshipUpdates };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'POST만 지원합니다.' });
  if (!process.env.OPENAI_API_KEY) return json(res, 503, { error: 'OPENAI_API_KEY가 설정되지 않았습니다.', code: 'NO_API_KEY' });

  const requiredToken = process.env.LUMENSIA_ACCESS_TOKEN;
  if (requiredToken && req.headers['x-lumensia-token'] !== requiredToken) {
    return json(res, 401, { error: '접속 토큰이 없거나 올바르지 않습니다.', code: 'BAD_ACCESS_TOKEN' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const action = typeof body.action === 'string' ? body.action : '';
    if (!action.trim()) return json(res, 400, { error: '행동 입력이 비어 있습니다.' });
    if (action.length > MAX_ACTION_CHARS) return json(res, 400, { error: `한 번의 입력은 ${MAX_ACTION_CHARS.toLocaleString()}자 이하로 입력해 주세요.` });

    const runState = body.runState && typeof body.runState === 'object' ? body.runState : {};
    const pc = safePc(runState.pc || {});
    const scene = safeScene(runState.scene || {});
    const history = Array.isArray(runState.history) ? runState.history.slice(-MAX_HISTORY_TURNS) : [];
    const knowledgeLevel = Math.max(1, Math.min(5, Number(runState.knowledgeLevel) || 1));
    const relationships = safeRelationships(runState.relationships || {});

    const apiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5.6-terra',
        store: false,
        instructions: WRITER_CONTRACT,
        input: buildInput({ action, pc, scene, history, knowledgeLevel, relationships }),
        reasoning: { effort: 'medium' },
        max_output_tokens: 5600,
        text: {
          format: {
            type: 'json_schema',
            name: 'lumensia_v0_scene',
            strict: true,
            schema: OUTPUT_SCHEMA,
          },
        },
      }),
      signal: AbortSignal.timeout(120_000),
    });

    const raw = await apiResponse.text();
    let response;
    try { response = raw ? JSON.parse(raw) : {}; }
    catch { throw new Error(`OpenAI가 JSON이 아닌 응답을 반환했습니다. HTTP ${apiResponse.status}`); }

    if (!apiResponse.ok) {
      const message = response?.error?.message || `OpenAI 요청 실패: HTTP ${apiResponse.status}`;
      const error = new Error(message);
      error.status = apiResponse.status;
      throw error;
    }

    const outputText = extractOutputText(response);
    if (!outputText) throw new Error('Writer 응답 본문이 비어 있습니다.');

    let parsed;
    try { parsed = JSON.parse(outputText); }
    catch { throw new Error('Writer structured output을 JSON으로 해석하지 못했습니다.'); }

    const turn = validateTurn(parsed, pc, scene);
    return json(res, 200, {
      turn,
      model: response?.model || process.env.OPENAI_MODEL || 'gpt-5.6-terra',
      request_id: response?.id || null,
      usage: response?.usage || null,
    });
  } catch (error) {
    const timeout = error?.name === 'TimeoutError' || error?.name === 'AbortError';
    const status = timeout ? 504 : (Number.isInteger(error?.status) ? error.status : 500);
    return json(res, status, {
      error: timeout ? 'Writer 응답 시간이 초과되었습니다. 게임 상태는 변경되지 않았습니다.' : (error?.message || 'Writer 요청 중 오류가 발생했습니다.'),
      code: timeout ? 'WRITER_TIMEOUT' : 'WRITER_ERROR',
    });
  }
}
