import assert from 'node:assert/strict';
import {
  ACADEMY_CAST_KEYS,
  academyCastIndex,
  buildCanonContext,
  detailedCharacterPackets,
  relevantOpenSituations,
  relevantScheduleFacts,
  visibleRelevantKnowledge,
} from '../api/lib/canon-context.js';

const emptyHistory = [];

const cast = academyCastIndex();
assert.ok(cast.length >= 10, 'academy cast should expose the established academy population without requiring player name mentions');
for (const key of ['emily','artemis','anastasia','isabel','sera','lillia','lena','laris','mirabelle','aria']) {
  assert.ok(ACADEMY_CAST_KEYS.includes(key), `dated academy cast missing ${key}`);
}
for (const key of ['delpirem','nemesis','carne','etera','seriel','sloth']) {
  assert.ok(!ACADEMY_CAST_KEYS.includes(key), `external/secret/high-tier character leaked into ordinary academy cast: ${key}`);
}

const lillia = cast.find((row) => row.key === 'lillia');
assert.ok(lillia, 'Lillia must be discoverable from academy dated state');
assert.equal(lillia.current_state.department, '기사과');
assert.match(JSON.stringify(lillia.presentation), /붉은 머리/);
assert.match(JSON.stringify(lillia.personality_signals), /검|호기심|솔직|열정/);
assert.ok((lillia.relationship_hints || []).some((row) => row.from === 'lillia' && row.to === 'laris'), 'thin cast should retain source-backed relationship signal');

const noScheduleGravity = relevantScheduleFacts({ time: '09:15', location: '생활동' }, '짐을 정리한다');
assert.equal(noScheduleGravity.length, 0, 'distant noon orientation must not be injected into ordinary 09:15 dorm prose context');
const imminentOrientation = relevantScheduleFacts({ time: '11:30', location: '학생식당' }, '식사를 마친다');
assert.ok(imminentOrientation.some((row) => row.time === '12:00'), 'imminent schedule may be supplied as continuity fact');
const askedSchedule = relevantScheduleFacts({ time: '09:15', location: '생활동' }, '오늘 오티 일정이 언제인지 확인한다');
assert.ok(askedSchedule.some((row) => row.time === '12:00'), 'explicit schedule query must retrieve the noon orientation fact');
assert.ok(askedSchedule.every((row) => String(row.semantic).includes('does not itself create')), 'schedule facts must carry state-not-event semantics');

assert.deepEqual(visibleRelevantKnowledge({ action: '생활동으로 간다', relevantKeys: [], knowledgeLevel: 1 }), [], 'unrelated public Knowledge must not flood an ordinary turn');
const lenaPublic = visibleRelevantKnowledge({ action: '레나에 대해 공개적으로 알려진 걸 확인한다', relevantKeys: ['lena'], knowledgeLevel: 1 });
assert.ok(lenaPublic.some((row) => row.id === 'lena_public_profile'), 'relevant public Lena knowledge should be retrievable');
assert.ok(!lenaPublic.some((row) => row.id === 'current_lena_artificial_origin'), 'Level-5 Lena secret must not leak into public retrieval');

assert.deepEqual(relevantOpenSituations('학교를 둘러본다', 5), [], 'open situations must not be injected merely because the system knows them');
const wolf = relevantOpenSituations('회색 늑대의 숲 의뢰를 확인한다', 2);
assert.ok(wolf.some((row) => row.id === 'gray_wolf_forest'), 'explicitly relevant learned open situation should be retrievable');

const training = buildCanonContext({
  action: '기사과 훈련장으로 간다',
  pc: { department: '기사과' },
  scene: { time: '09:30', location: '루멘시아 아카데미 중앙광장', presentCharacterKeys: [] },
  history: emptyHistory,
  knowledgeLevel: 1,
});
assert.match(String(training.academy.location_context.zones?.west || ''), /기사과/, 'academy location context must preserve explicit Canon west=knight layout');
assert.ok(training.academy.location_context.relevant_facilities.knight, 'training action should retrieve knight facility fact');
assert.equal(training.schedule.length, 0, '09:30 training action must not be dragged toward noon orientation');
assert.equal(training.pc_visible_knowledge.length, 0, 'training action should not receive unrelated public politics/power gossip');
assert.match(String(training.retrieval_semantics?.system_truth_not_knowledge), /do not automatically become PC or NPC knowledge/, 'scene packet must preserve the system-truth versus knowledge boundary');

const guild = buildCanonContext({
  action: '모험가 길드에 가서 의뢰를 확인한다',
  pc: { department: '기사과' },
  scene: { time: '16:00', location: '아스테리온 시가지', presentCharacterKeys: [] },
  history: emptyHistory,
  knowledgeLevel: 1,
});
assert.ok(guild.society.adventurer_guild, 'guild action should retrieve guild institution facts');
assert.deepEqual(guild.relevant_open_situations, [], 'guild visit alone must not auto-inject unrelated world incidents');

const lilliaDetail = detailedCharacterPackets({ keys: ['lillia'], action: '', knowledgeLevel: 1 })[0];
assert.match(JSON.stringify(lilliaDetail.presentation), /금안/);
assert.ok(lilliaDetail.dated_relationships.some((row) => row.to === 'laris' || row.from === 'laris'), 'detailed packet must retain dated relationship context');
assert.match(String(lilliaDetail.epistemic_boundary), /not automatically PC knowledge/, 'portrayal truth must be explicitly distinct from PC knowledge');

console.log('PASS factual Canon retrieval invariants');