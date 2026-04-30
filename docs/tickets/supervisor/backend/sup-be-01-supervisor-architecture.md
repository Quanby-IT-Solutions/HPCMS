# SUP-BE-01 — Supervisor Capability Surface & Contract Design

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Backend |
| Category | Planning & Architecture |
| Phase | TOR Phase 1 |
| Source Refs | All Supervisor stories |
| Existing Code | `apps/backend/src/modules/v1/{patients,cases,practitioners}/`, `packages/contracts/` |

## Scope

Identify which supervisor-facing capabilities extend existing modules vs. need new ones. Output a design note and contract layout used by SUP-BE-02..SUP-BE-12.

## Objectives

- Design note `apps/backend/docs/supervisor-module-design.md`.
- Identify new sub-modules: `incidents/`, `programs/`, `devices/`, `consent/`, `knowledge-base/`, `risk-engine/`.
- Skeleton modules + contract mirrors.
- `case-supervisor.guard.ts` allowing supervisor + tenant-admin + system-admin.

## Dependencies

- SA-BE-01, TA-BE-01.

## Acceptance Criteria

- [ ] Design note committed.
- [ ] Skeletons compile.
- [ ] Guard rejects non-supervisor seed roles where appropriate.
- [ ] `pnpm --filter @repo/backend typecheck` passes.

## Verification

- **Automated check**: `pnpm --filter @repo/backend typecheck && pnpm --filter @repo/contracts typecheck`.
