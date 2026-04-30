# CL-BE-01 — SMART on FHIR Launch Architecture

| Field | Value |
|-------|-------|
| Role  | Clinician |
| Layer | Backend |
| Category | Planning & Architecture |
| Phase | TOR Phase 2 |
| Source Refs | TOR: IR-04 |
| Existing Code | `packages/fhir/auth/`, `apps/backend/src/common/fhir/`, `packages/auth/` |

## Scope

Decide module layout for SMART on FHIR launch validation, clinician case summary aggregation, clinical note/flag, and FHIR enrichment. Output design note + skeletons.

## Objectives

- Design note `apps/backend/docs/clinician-smart-design.md`.
- New module: `apps/backend/src/modules/v1/clinician/{launch,summary,notes,enrichment}/`.
- Contract mirrors.
- `clinician.guard.ts` allowing clinician + tenant_admin + system_admin.

## Dependencies

- SA-BE-01.

## Acceptance Criteria

- [ ] Design note committed.
- [ ] Skeletons compile.
- [ ] Guard correctly scoped.

## Verification

- **Automated check**: `pnpm --filter @repo/backend typecheck && pnpm --filter @repo/contracts typecheck`.
