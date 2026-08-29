# Reference Material

Reference play logs are intentionally isolated from production runtime.

## Authoritative development sources for this clean-room reset

- `견본_260828_201340.txt` — academy opening through later academy/guild/adventure scenes
  - materialized source size: 113,903 bytes
  - SHA-256: `26ed54d6ea2bfb2a4346781a2a2dffd89ae1ecafdfdf54c916fdbf1fe2f347a3`
- `견본.txt` — Isabel/political/combat/quiet-relationship reference
  - materialized source size: 59,309 bytes
  - SHA-256: `0f7a083b7162acd14de40ab9b25fe565affa7beffa34ed232d35eb5f40573823`

The raw uploads remain source material outside production code. Their hashes are recorded here so future migration/QA work can confirm it is using the same files rather than similarly named copies.

Raw reference prose must not be imported by `src/` or `api/`, placed in production prompts, or treated as Canon.

See `docs/REFERENCE_POLICY.md` and `QUALITY_BENCHMARK.md`.
