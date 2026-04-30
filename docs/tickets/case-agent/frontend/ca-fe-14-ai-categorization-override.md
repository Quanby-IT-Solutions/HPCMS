# CA-FE-14 — AI Auto-Categorization & Override UI

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 3 |
| Source Refs | User Stories: 5.1 · User Flows: E1 · TOR: FR-03 |
| Existing Code | CA-FE-08, SA-BE-08 |

## Scope

Inline AI-suggestion UX on inbox items: auto-applied category badge with confidence, inline accept-and-route, and override-with-correction control.

## Objectives

- Inbox item: badge with category name + confidence bar.
- Detail view: AI suggestion panel showing recommended case type and routing team with `Accept & Route` button.
- `Override` opens a category dropdown + reason field; submitting logs the override (trains future classifier).
- Persisting both accept and override events for analytics.

## Dependencies

- CA-FE-08, SA-BE-08.

## Acceptance Criteria

- [ ] Suggestion badge appears on every new item with classifier output.
- [ ] Accept-and-route creates/links a case with the suggested type.
- [ ] Override updates the case category and logs the override.
- [ ] No suggestion → no badge.

## Verification

- **Manual demo**: submit a test inbox item and observe suggestion; override it.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
