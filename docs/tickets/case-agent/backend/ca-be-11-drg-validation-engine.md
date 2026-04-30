# CA-BE-11 — DRG Coding & Validation Engine

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 3 |
| Source Refs | User Stories: 9.5, 9.6 · User Flows: I3 · TOR: FP-01 |
| Existing Code | CA-BE-10 |

## Scope

Schema and endpoints supporting up to 12 secondary diagnoses and 20 procedures per claim, plus validation that enforces these limits and surfaces approaching-limit warnings.

## Objectives

- Schema: `claim_drg_diagnoses` (claim_id, position 1–12, icd_code).
- Schema: `claim_drg_procedures` (claim_id, position 1–20, code, code_system PHIC|CPT).
- Endpoints: `claims.drg.diagnoses.*`, `claims.drg.procedures.*`, `claims.drg.validate`.
- Validate: limit enforcement + code format check + at-least-one-procedure presence.
- Code lookup endpoint: `codes.lookup` (ICD/CPT/PHIC search by term).

## Dependencies

- CA-BE-01, CA-BE-10.

## Acceptance Criteria

- [ ] Migrations create the two tables.
- [ ] Adding a 13th diagnosis returns 400 with limit error.
- [ ] Code lookup returns sample codes.
- [ ] Validate returns OK when claim is complete.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test drg && pnpm --filter @repo/backend typecheck`.
