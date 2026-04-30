# CA-FE-18 — DRG Coding Panel (12 Dx / 20 Procedures)

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 3 |
| Source Refs | User Stories: 9.5, 9.6 · User Flows: I3 · TOR: FP-01 |
| Existing Code | CA-FE-17, CA-BE-11 |

## Scope

Panel on Claim Detail enforcing PhilHealth DRG limits: up to 12 secondary diagnosis ICD codes and up to 20 PHIC/CPT procedure codes per claim, with code lookup and limit indicators.

## Objectives

- `<DRGCodingPanel>` showing two numbered lists (Secondary Diagnoses 1–12, Procedures 1–20).
- "Add Secondary Diagnosis" form: ICD search, description, add.
- "Add Procedure" form: PHIC/CPT search, description, add.
- Limit indicators with warning when ≥ 80% capacity and hard block at limit.
- Drag-to-reorder within each list.
- Saved data flows into XML export.

## Dependencies

- CA-FE-17, CA-BE-11.

## Acceptance Criteria

- [ ] Adding > 12 secondary diagnoses is rejected with a clear error.
- [ ] Adding > 20 procedures is rejected.
- [ ] Reordering persists.
- [ ] Saved data appears in CF5 export (CA-FE-20).

## Verification

- **Manual demo**: log in as `agent@hpcms.local`, open a claim, add codes, attempt to exceed 12.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
