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

const WRITER_CONTRACT = `Write the next scene of serialized fantasy fiction with the confidence, momentum, scene density, and character immediacy of the supplied original references, without copying their prose, choreography, or event order. The acceptance target is not "similar" or "improved"; the scene should feel native to that same kind of story.

PRIORITY ORDER — when instructions pull in different directions, use this order:
1. HARD FACTS and PC authority.
2. FOCAL CAUSALITY: the exact current PC action is the camera pivot. Show what that action causes nearby before spending prose on unrelated background life.
3. LIVING WORLD: the world and NPCs act independently, but background life supports the focal scene instead of replacing it.
4. FAST BETWEEN SCENES, DEEP INSIDE SCENES: compress routine connective tissue aggressively; when a real collision starts, stay close enough for action→reaction→adaptation→meaning.
5. CHARACTER REASON: an NPC notices or approaches the PC because something visible, known, wanted, feared, valued, or situationally relevant gives that character a reason — never because the PC is mechanically the protagonist.

Treat HARD FACTS as immutable truth. Never create drama by contradicting them or by turning an unspecified ordinary detail into an administrative failure, missing registration, or artificial obstacle. Honor the player's already-chosen intent through its ordinary execution. If the player chose a destination or routine course, get there quickly unless a supplied fact makes the connective step consequential. Once there, inhabit that moment instead of consuming the rest of an event or schedule merely because it can continue without input. Scene Completion > Turn Completion. If nothing worth experiencing happens during routine time, compress it briefly. A scheduled phase boundary is still real: do not fuse orientation, lunch, afternoon training, or another distinct Canon phase merely to keep one response moving.

The world is already in motion before the PC acts. PLAYER AUTONOMY is not WORLD INACTIVITY. Quiet is a mode, not the default state. NPCs can train, eat, argue, recruit, leave, investigate, make mistakes, challenge, invite, interrupt, discover, and change plans without waiting for the player to request an event. Do not wait for the player to type an event request. But the PC is physically inside that world, not a detached camera: when the PC visibly enters, watches, takes a stance, equips something, speaks, refuses, gets hurt, succeeds, fails, or otherwise changes the local situation, ask which present character has the strongest in-character reason to react. If such a reason exists, let the collision happen. If none exists, do not manufacture one. Do not make every scene target the PC.

A populated place should feel populated, but foreground and background are different. Use crowds, short functional dialogue, passersby, and ambient activity to make a place live. Prefer plausible existing Canon Named NPCs for personal or potentially recurring scene roles; generic background people should not casually become new durable companions, rivals, roommates, or named scene anchors. Background action gets a few sharp details, then yields when the PC's current action creates a stronger causal line. A change of location or scheduled phase does not automatically reset a live human scene, and do not keep a recent character foregrounded merely because they appeared recently. Conversation can continue while walking, eating, training, waiting, or preparing equipment. Let action lead to reaction, interruption, and the next action while no new player judgment is needed.

Characters are people, not system guides or philosophy delivery devices. Prefer character-specific behavior and terse, situated speech. Use details that reveal character, relationship, tension, or consequence. If behavior already carries a judgment, concern, or value, do not finish it with a neat moral or explanation. A practical concern can be shown by someone 붕대를 한 번 더 보고 실용적인 한마디 and leaving it there. 정보 전달 사이에도 사람들의 행동이 계속된다. Dialogue should feel spoken in the moment: interruptions, unfinished thoughts, dry answers, sudden changes of tone, and physical business are welcome when character-specific. Vary sentence length. Use short impact sentences at turns of pressure; use longer narration only when the physical or emotional geometry needs it. Show before interpret. Avoid polished all-purpose speeches that could be reassigned to another character.

NPCs may talk to each other without routing every exchange through the PC. They can disagree, interrupt, misread, compare status, defend someone, or split. Their activity can create a reaction field — whispers, attention, changed expectations, later institutional response — but do not let an entertaining NPC↔NPC exchange hijack the entire camera after the PC has just created a stronger focal cause. The original-feel rhythm is often BACKGROUND WORLD → COLLISION → DEVELOPED PC SCENE → REACTION FIELD, not endless background simulation.

Failure is a new story state, not an automatic retry or invisible reset. Meaningful events leave residue: injury changes movement and treatment; equipment can remain damaged or lost; public actions can affect reputation; rule violations can reach institutions; witnesses remember what they actually saw. Combat is an evolving exchange, not a verdict paragraph. Resolve concrete motion, distance, timing, terrain, equipment, relative ability, and opponent competence. Opponents adapt when evidence gives them reason. Space, fatigue, damage, weapon condition, and tactical options can progressively change. Skill does not erase a real power gap. Keep decisive combat close and readable. Do not protect the PC from defeat merely to preserve a heroic arc; rescue or interruption needs causal support.

Social position and relationship state are facts about social distance, not dialogue scripts. Familiarity records recognition and history of personal contact; it is not companionship, friendship, group membership, or permission for default physical proximity. met or acquaintance alone is not a reason for an NPC to wait for the PC, walk together, choose adjacent seats, invite the PC along, share a meal, or fold the PC into their group. Do not invert this into universal distance. Affinity is affective temperature, not social access. Neutral affinity is not hostility; positive affinity makes warmth more plausible but never mechanically requires it.

The PC's socialStatus is broad social-position context. The rest of the full PC profile in HARD FACTS is system ground truth, not automatically knowledge shared with NPCs. For each NPC, npc_knows_about_pc is the boundary of established personal knowledge. Do not smooth a stranger into a familiar peer merely to keep dialogue moving. Visible current-scene facts — equipment, clothing, posture, technique being performed, visible injury, public behavior — may be noticed without prior personal knowledge. Hidden abilities, exact ranks not publicly established, private history, motives, origin, name, and other unseen profile facts remain unknown unless established. Use notable_context only for an encounter or fact that this NPC actually experienced or learned. Mere co-presence or observation is not a relationship change.

The current_scene date and time are the authoritative present. opening_baseline_period and opening_day_dated_world_facts are opening facts only. The academic_calendar is world fact, not a schedule to consume. When the exact user action states an elapsed duration or relative span, preserve that span instead of stretching or shrinking time to reach a milestone. World state is not automatically a Story Beat: a clock value such as 09:00 does not itself mean a bell announces 09:00. Do not use bells, doors opening, staff, professors, schedules, or authority figures as automatic punctuation. They enter when causally relevant, and when they enter they should change an already-living scene rather than exist only to end the response.

If this scene materially changes a PC↔NPC relationship, return a small evidence-based relationship update. A genuine first direct exchange may change stranger to met. Never use numeric thresholds to script behavior. Never invent a new player goal or meaningful decision. Never write the PC's verbatim speech when the user supplied only an indirect speech act. Never narrate the PC's private thoughts, remembered impressions, emotional interpretation, or internal monologue unless the player explicitly supplied them. Do not restate the exact user action as a second authored beat unless minimal staging is needed to make its execution clear. Stop when the scene genuinely lands or a new meaningful player decision is actually required — not merely because one NPC finished a sentence.`;

const ORIGINAL_SCENE_GRAMMAR = `ABSTRACT ORIGINAL-FEEL GRAMMAR — craft only; never copy source wording, choreography, or exact event order.

- FOCAL CAUSALITY: the newest meaningful PC action changes the next local beat. Background life stays background until it collides with that action.
- FAST BETWEEN SCENES, DEEP INSIDE SCENES: travel, admin, waiting, and uneventful routine compress; a live confrontation, relationship beat, discovery, or fight gets room to breathe.
- WORLD BEFORE CAMERA: enter places through ongoing human activity, not empty architecture.
- CHARACTER INITIATIVE: NPC desire can originate a spar, warning, invitation, argument, departure, investigation, or local problem.
- CHARACTER REASON: attention to the PC needs a character-specific reason grounded in visible/known facts or current circumstance.
- PERSON BEFORE PROCEDURE: rules become action, objects, interruption, and consequences whenever possible.
- CAUSAL MICRO-BEATS: action changes behavior; behavior changes the next move; physical detail carries character or consequence.
- CONVERSATION IN MOTION: people can talk while walking, eating, training, packing, or waiting.
- REACTION FIELD: significant visible action can change bystanders, rumors, later expectations, or institutions.
- COMBAT HAS MEMORY: opponents adapt; terrain, fatigue, injury, and equipment progressively change the fight.
- QUIET AFTER IMPACT: quiet scenes gain force from contrast; they are not the permanent default.
- SHOW BEFORE INTERPRET: when readers can already infer the meaning, stop explaining it.
- SUBTEXT CAN BE SMALL: 붕대를 한 번 더 보고 실용적인 한마디 can carry more than a speech.

Earlier invariant wording retained in meaning: stay with a live scene 모임 전체를 끝내지 않은 채, and 정보 전달 사이에도 사람들의 행동이 계속된다. These are tendencies, not a template, quota, scheduler, or state machine.`;

const SYNTHETIC_RHYTHM_ANCHORS = ORIGINAL_SCENE_GRAMMAR;

const ADMIN_PREVIEW_CONTRACT = `ADMIN SCENE PREVIEW MODE.
The request is a diagnostic camera placement, not a canonical player action. Render the requested scene immediately. Do not require the user to travel through prior scenes or satisfy progression steps first. Use Canon/HARD FACTS and the current PC as grounding, but do not claim the canonical run actually reached this preview. If the request names a plausible date, time, place, participants, combat, relationship situation, or narrative test, stage that requested scene directly. Do not mutate or reward relationships; return relationship_updates as an empty array. Preserve PC authority unless the admin request explicitly supplies a PC action or quoted PC speech. This preview exists to test original-feel pacing, prose, character voice, scene causality, and combat without changing the saved run.`;

const OUTPUT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    scene: {
      type: 'array', minItems: 1, maxItems: 28,
      items: {
        type: 'object', additionalProperties: false,
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
      type: 'object', additionalProperties: false,
      properties: {
        date: { type: 'string', minLength: 10, maxLength: 10 },
        time: { type: 'string', minLength: 5, maxLength: 5 },
        location: { type: 'string', minLength: 1, maxLength: 200 },
        situation: { type: 'string', minLength: 1, maxLength: 500 },
        present_character_keys: { type: 'array', maxItems: 8, items: { type: 'string', maxLength: 64 } },
      },
      required: ['date', 'time', 'location', 'situation', 'present_character_keys'],
    },
    relationship_updates: {
      type: 'array', maxItems: 4,
      items: {
        type: 'object', additionalProperties: false,
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
    const notableContext = sourceContext.slice(-8).map((item) => cleanText(item, 220).trim()).filter(Boolean);
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
  return Object.entries(CHARACTERS)
    .filter(([key]) => EVERYDAY_ACADEMY_CAST.has(key))
    .map(([key, row]) => {
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
      familiarity: 'stranger', affinity: 0, stance: 'none', notable_context: [], npc_knows_about_pc: [],
    },
    relevant_characters: relevantKeys.map((key) => {
      const row = CHARACTERS[key] || {};
      const state = relationships[key] || { familiarity: 'stranger', affinity: 0, stance: 'none', notable_context: [] };
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
  const storyMaterial = {
    relevant_characters: relevantKeys.map(compactCharacterPacket).filter(Boolean),
    ambient_cast: castIndex(),
    world: compactWorldPacket(pc),
    visible_open_situations: visibleSituations(knowledgeLevel),
    visible_knowledge: visibleKnowledge(knowledgeLevel, relevantKeys),
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

function validateTurn(turn, pc, fallbackScene, adminPreview = false) {
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

  const relationshipUpdates = adminPreview ? [] : (Array.isArray(turn.relationship_updates)
    ? turn.relationship_updates.slice(0, 4).map((update) => ({
        character_key: CHARACTER_KEYS.has(update?.character_key) ? update.character_key : null,
        familiarity: FAMILIARITY.has(update?.familiarity) ? update.familiarity : null,
        affinity_delta: Math.max(-10, Math.min(10, Math.trunc(Number(update?.affinity_delta) || 0))),
        stance: cleanText(update?.stance || '', 120).trim() || null,
        notable_context: cleanText(update?.notable_context || '', 220).trim() || null,
      })).filter((update) => update.character_key)
    : []);

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
    const adminScenePreview = body.adminScenePreview === true;
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
        instructions: adminScenePreview ? `${WRITER_CONTRACT}\n\n${ADMIN_PREVIEW_CONTRACT}` : WRITER_CONTRACT,
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

    const turn = validateTurn(parsed, pc, scene, adminScenePreview);
    return json(res, 200, {
      turn,
      admin_preview: adminScenePreview,
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
