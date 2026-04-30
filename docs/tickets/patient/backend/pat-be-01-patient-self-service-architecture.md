# PAT-BE-01 — Patient Self-Service API Surface & Contract Layout

| Field | Value |
|-------|-------|
| Role  | Patient |
| Layer | Backend |
| Category | Planning & Architecture |
| Phase | TOR Phase 1 |
| Source Refs | All Section F user stories |
| Existing Code | `apps/backend/src/modules/v1/{cases,attachments,notifications}/`, `packages/auth/`, `packages/contracts/` |

## Scope

Decide module/contract layout for patient-self-service: registration, MFA, LOA submission, my requests, KB search, chatbot, notifications, secure chat. Output design note + skeletons + `patient.guard.ts`.

## Objectives

- Design note `apps/backend/docs/patient-portal-design.md`.
- New module: `apps/backend/src/modules/v1/portal/{auth,loa,my-requests,kb-search,chatbot,notifications,chat}/`.
- Contract mirrors.
- `patient.guard.ts` allowing only `patient` role for portal-write actions; reads scoped to caller's own patient record.
- `requirePatientOwnership(patientIdParam)` helper.

## Dependencies

- SA-BE-01.

## Acceptance Criteria

- [ ] Design note committed.
- [ ] Skeletons compile.
- [ ] Guard enforces self-only access (e.g., patient B cannot read patient A's data).
- [ ] `pnpm --filter @repo/backend typecheck` passes.

## Verification

- **Automated check**: `pnpm --filter @repo/backend typecheck && pnpm --filter @repo/contracts typecheck`.
