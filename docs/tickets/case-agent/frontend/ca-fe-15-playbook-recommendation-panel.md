# CA-FE-15 — Playbook Recommendation Panel

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 3 |
| Source Refs | User Stories: 5.3 · User Flows: E3 · TOR: FR-03 |
| Existing Code | CA-FE-06, CA-BE-09 |

## Scope

Right-rail panel on Case Detail rendering a numbered, checkable playbook tied to the case's type. Persists per-case checklist state.

## Objectives

- `<PlaybookRecommendationPanel>` rendered on Case Detail when a playbook exists for the case type.
- Numbered steps with checkboxes; per-step deep links to the relevant tool/form.
- State persists per case (visible across agents).
- "View Playbook Library" link to a (read-only) list of all playbooks.

## Dependencies

- CA-FE-06, CA-BE-09.

## Acceptance Criteria

- [ ] Panel renders for cases of types with a playbook.
- [ ] Checking a step persists.
- [ ] Deep links navigate to the linked action.
- [ ] On case closure, completion percentage recorded.

## Verification

- **Manual demo**: open an LOA case, check off steps.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
