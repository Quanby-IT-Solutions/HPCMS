# SUP-FE-10 — Related Case Linking UI

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 3.10 · User Flows: C7 |
| Existing Code | SUP-FE-02, SUP-BE-05 |

## Scope

Right-rail Related Cases panel with a Case Search modal that supports linking cases via typed relationships ("Follow-up from", "Spawned from", "Duplicate of", "Part of Incident").

## Objectives

- `<RelatedCasesPanel>` on Case Detail listing linked cases with relationship label, status badge, and "Open Case" link.
- "Link Case" button opens `<CaseSearchModal>` (search by case id, patient name, type, date range; multi-select).
- Relationship-type selector applied at confirm.
- Reverse reference auto-created on the linked side.
- Audit linkage events.

## Dependencies

- SUP-FE-02, SUP-FE-08, SUP-BE-05.

## Acceptance Criteria

- [ ] Panel renders linked cases.
- [ ] Search modal returns filtered case results.
- [ ] Linking with relationship "Spawned from" creates the link and a reverse reference on the target case.
- [ ] Removing a link is auditable.
- [ ] Inaccessible to patients.

## Verification

- **Manual demo**: log in as `supervisor@hpcms.local`, link two cases.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
