# CA-BE-01 — Agent-Facing Services Architecture & Contracts

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Backend |
| Category | Planning & Architecture |
| Phase | TOR Phase 1 |
| Source Refs | All Case Agent stories |
| Existing Code | `apps/backend/src/modules/v1/{cases,patients,attachments,notifications}/`, `packages/contracts/` |

## Scope

Decide module/contract layout for Case Agent functionality (queue, inbox, channels, claims, playbook, code lookup). Output skeleton modules and a `case-agent.guard.ts`.

## Objectives

- Design note `apps/backend/docs/agent-module-design.md`.
- Sub-modules: `inbox/`, `channels/{email,phone,social,chat}`, `claims/`, `drg/`, `playbooks/`, `code-lookup/`.
- Contract mirrors.
- Guard allowing case_agent + case_supervisor + tenant_admin + system_admin.

## Dependencies

- SA-BE-01.

## Acceptance Criteria

- [ ] Design note committed.
- [ ] Skeletons compile.
- [ ] Guard rejects patient and clinician seed users.
- [ ] `pnpm --filter @repo/backend typecheck` passes.

## Verification

- **Automated check**: `pnpm --filter @repo/backend typecheck && pnpm --filter @repo/contracts typecheck`.
