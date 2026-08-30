import assert from 'node:assert/strict';
import {
  ACADEMY_CAST_KEYS,
  academyCastIndex,
  buildCanonContext,
  detailedCharacterPackets,
  relevantCharacterKeys,
  relevantOpenSituations,
  relevantScheduleFacts,
  visibleRelevantKnowledge,
} from '../api/lib/canon-context.js';

const emptyHistory = [];
const neutralScene = { time: '09:15', location: '생활동', presentCharacterKeys: [] };

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

assert.deepEqual(
  relevantCharacterKeys({ action: '엘레나와 이야기한다', scene: neutralScene, history: emptyHistory }),
  ['elena'],
  'short Korean name must select Elena without leaking the nested Lena alias',
);
assert.deepEqual(
  relevantCharacterKeys({ action: '세레나에게 간다', scene: neutralScene, history: emptyHistory }),
  ['serena'],
  'Serena must not also select the nested Lena alias',
);
assert.deepEqual(
  relevantCharacterKeys({ action: '엘레나와 레나를 찾는다', scene: neutralScene, history: emptyHistory }),
  ['elena', 'lena'],
  'separate explicit mentions must preserve both characters in mention order',
);
assert.deepEqual(
  relevantCharacterKeys({ action: 'talk to the librarian', scene: neutralScene, history: emptyHistory }),
  [],
  'ASCII character keys must require token boundaries instead of matching inside ordinary words',
);
assert.deepEqual(
  relevantCharacterKeys({ action: 'ask elena about the lesson', scene: neutralScene, history: emptyHistory }),
  ['elena'],
  'ASCII Elena key must not also select Lena',
);
assert.deepEqual(
  relevantCharacterKeys({
    action: '자리에 앉아 주변을 살핀다',
    scene: { time: '08:40', location: '루멘시아 마법 아카데미 대강당', presentCharacterKeys: [] },
    history: emptyHistory,
  }),
  [],
  'location alone must not choose an NPC or force a detailed character packet',
);
assert.deepEqual(
  relevantCharacterKeys({
    action: '자리에 앉아 주변을 살핀다',
    scene: { time: '08:40', location: '루멘시아 마법 아카데미 대강당', presentCharacterKeys: ['emily'] },
    history: emptyHistory,
  }),
  ['emily'],
  'explicit scene presence must still select Emily',
);

const lilliaConversation = buildCanonContext({
  action: '릴리아와 이야기한다',
  pc: { department: '기사과' },
  scene: neutralScene,
  history: emptyHistory,
});
assert.ok(!Object.hasOwn(lilliaConversation.society, 'religion'), 'Lillia mention must not retrieve Lily religion Canon through a substring collision');
const lilyPrayer = buildCanonContext({
  action: '여신 릴리에게 기도한다',
  pc: { department: '신학부' },
  scene: { time: '09:15', location: '호숫가 예배당', presentCharacterKeys: [] },
  history: emptyHistory,
});
assert.ok(lilyPrayer.society.religion, 'an explicit Lily reference must still retrieve religion Canon');

const magicDepartment = buildCanonContext({
  action: '마법과 강의동으로 간다',
  pc: { department: '마법과' },
  scene: neutralScene,
  history: emptyHistory,
});
assert.ok(!Object.hasOwn(magicDepartment.society, 'status_and_law'), 'magic terminology must not retrieve legal Canon merely because 마법 contains 법');
const lawQuestion = buildCanonContext({
  action: '이곳의 법을 확인한다',
  pc: { department: '기사과' },
  scene: neutralScene,
  history: emptyHistory,
});
assert.ok(lawQuestion.society.status_and_law, 'an explicit standalone law reference must still retrieve legal Canon');

const noScheduleGravity = relevantScheduleFacts({ time: '09:15', location: '생활동' }, '짐을 정리한다');
assert.equal(noScheduleGravity.length, 0, 'distant noon orientation must not be injected into ordinary 09:15 dorm prose context');
const durationNotSchedule = relevantScheduleFacts({ time: '09:15', location: '생활동' }, '시간을 들여 짐을 정리한다');
assert.equal(durationNotSchedule.length, 0, 'ordinary duration language must not be mistaken for an explicit schedule query');
const habitualNotSchedule = relevantScheduleFacts({ time: '09:15', location: '훈련장' }, '언제나 하던 대로 검을 휘두른다');
assert.equal(habitualNotSchedule.length, 0, '언제나 must not be mistaken for an explicit schedule query');
const imminentOrientation = relevantScheduleFacts({ time: '11:30', location: '학생식당' }, '식사를 마친다');
assert.ok(imminentOrientation.some((row) => row.time === '12:00'), 'imminent schedule may be supplied as continuity fact');
const askedSchedule = relevantScheduleFacts({ time: '09:15', location: '생활동' }, '오늘 오티 일정이 언제인지 확인한다');
assert.ok(askedSchedule.some((row) => row.time === '12:00'), 'explicit schedule query must retrieve the noon orientation fact');
assert.ok(askedSchedule.every((row) => String(row.semantic).includes('does not itself create')), 'schedule facts must carry state-not-event semantics');

assert.deepEqual(visibleRelevantKnowledge({ action: '생활동으로 간다', relevantKeys: [] }), [], 'unrelated public Knowledge must not flood an ordinary turn');
const lenaPublic = visibleRelevantKnowledge({ action: '레나에 대해 공개적으로 알려진 걸 확인한다', relevantKeys: ['lena'] });
assert.ok(lenaPublic.some((row) => row.id === 'lena_public_profile'), 'relevant public Lena knowledge should be retrievable');
assert.ok(lenaPublic.every((row) => row.public === true && row.visibility === 1), 'PC-visible Knowledge must remain explicitly public at the current V0 boundary');

const forgedLenaAccess = visibleRelevantKnowledge({
  action: '레나의 숨겨진 기원을 확인한다',
  relevantKeys: ['lena'],
  knowledgeLevel: 5,
});
assert.ok(!forgedLenaAccess.some((row) => row.id === 'current_lena_artificial_origin'), 'client-supplied global knowledgeLevel must not unlock a Level-5 Lena secret');

assert.deepEqual(relevantOpenSituations('학교를 둘러본다', 5), [], 'open situations must not be injected merely because the system knows them');
const wolf = relevantOpenSituations('회색 늑대의 숲 의뢰를 확인한다', 5);
assert.ok(wolf.some((row) => row.id === 'gray_wolf_forest'), 'explicitly reached low-risk open situation should be retrievable');
const forgedRestrictedSituation = relevantOpenSituations('동부 어비스 영향권의 마기 농도를 조사한다', 5);
assert.ok(!forgedRestrictedSituation.some((row) => row.id === 'silent_expansion'), 'client-supplied global knowledgeLevel must not unlock a restricted open situation');

const training = buildCanonContext({
  action: '기사과 훈련장으로 간다',
  pc: { department: '기사과' },
  scene: { time: '09:30', location: '루멘시아 아카데미 중앙광장', presentCharacterKeys: [] },
  history: emptyHistory,
  knowledgeLevel: 5,
});
assert.match(String(training.academy.location_context.zones?.west || ''), /기사과/, 'academy location context must preserve explicit Canon west=knight layout');
assert.ok(training.academy.location_context.relevant_facilities.knight, 'training action should retrieve knight facility fact');
assert.equal(training.schedule.length, 0, '09:30 training action must not be dragged toward noon orientation');
assert.equal(training.pc_visible_knowledge.length, 0, 'training action should not receive unrelated public politics/power gossip');
assert.match(String(training.retrieval_semantics?.system_truth_not_knowledge), /do not automatically become PC or NPC knowledge/, 'scene packet must preserve the system-truth versus knowledge boundary');
assert.match(String(training.retrieval_semantics?.epistemic_access), /not a global PC permission ladder/, 'scene packet must state that visibility metadata is not global PC authorization');

const forgedEteraAccess = buildCanonContext({
  action: '에테라의 정확한 마법 경지를 확인한다',
  pc: { department: '마법과' },
  scene: { time: '10:00', location: '루멘시아 아카데미 대도서관', presentCharacterKeys: [] },
  history: emptyHistory,
  knowledgeLevel: 5,
});
assert.ok(!forgedEteraAccess.pc_visible_knowledge.some((row) => row.id === 'etera_nine_circle'), 'client-supplied global knowledgeLevel must not unlock Etera nine-circle Canon');

const guild = buildCanonContext({
  action: '모험가 길드에 가서 의뢰를 확인한다',
  pc: { department: '기사과' },
  scene: { time: '16:00', location: '아스테리온 시가지', presentCharacterKeys: [] },
  history: emptyHistory,
});
assert.ok(guild.society.adventurer_guild, 'guild action should retrieve guild institution facts');
assert.deepEqual(guild.relevant_open_situations, [], 'guild visit alone must not auto-inject unrelated world incidents');

const lilliaDetail = detailedCharacterPackets({ keys: ['lillia'], action: '', knowledgeLevel: 5 })[0];
assert.match(JSON.stringify(lilliaDetail.presentation), /금안/);
assert.ok(lilliaDetail.dated_relationships.some((row) => row.to === 'laris' || row.from === 'laris'), 'detailed packet must retain dated relationship context');
assert.match(String(lilliaDetail.epistemic_boundary), /not automatically PC knowledge/, 'portrayal truth must be explicitly distinct from PC knowledge');

console.log('PASS factual Canon retrieval invariants');
