export function npcAppearanceStatsAccurate(run = {}, characterNames = {}, maxTurns = 50) {
  const history = (Array.isArray(run?.history) ? run.history : []).slice(-maxTurns);
  const entries = Object.entries(characterNames || {}).sort((a, b) => String(b[1]).length - String(a[1]).length);
  const counts = new Map(entries.map(([key]) => [key, 0]));

  for (const turn of history) {
    const seen = new Set();
    const persisted = turn?.persistedSceneState?.present_character_keys;
    const fallback = turn?.continuity?.present_character_keys;
    const cast = Array.isArray(persisted) ? persisted : (Array.isArray(fallback) ? fallback : []);
    for (const key of cast) if (counts.has(key)) seen.add(key);

    for (const beat of Array.isArray(turn?.scene) ? turn.scene : []) {
      if (counts.has(beat?.speaker_key)) seen.add(beat.speaker_key);
      let remaining = String(beat?.text || '');
      for (const [key, rawName] of entries) {
        const name = String(rawName || '');
        if (!name || !remaining.includes(name)) continue;
        seen.add(key);
        remaining = remaining.split(name).join(' '.repeat(name.length));
      }
    }

    for (const key of seen) counts.set(key, (counts.get(key) || 0) + 1);
  }

  const rows = [...counts.entries()]
    .filter(([, count]) => count > 0)
    .map(([key, count]) => ({ key, name: characterNames[key] || key, count }))
    .sort((a, b) => b.count - a.count || String(a.name).localeCompare(String(b.name), 'ko'));
  return { sampleTurns: history.length, rows };
}
