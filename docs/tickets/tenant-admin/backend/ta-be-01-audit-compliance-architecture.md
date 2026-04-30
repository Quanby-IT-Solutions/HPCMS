# TA-BE-01 — Audit/Compliance Module Architecture

| Field | Value |
|-------|-------|
| Role  | Tenant Admin |
| Layer | Backend |
| Category | Planning & Architecture |
| Phase | TOR Phase 1 |
| Source Refs | All TA stories · TOR: SC-01, SC-03, NFR-02 |
| Existing Code | `apps/backend/src/common/audit/`, `packages/db/schema/audit.ts` |

## Scope

Decide and document the module layout for compliance, audit, PHI access, handoff audit, incident ops, facility config, shared policies, and cross-facility reports. Output skeleton modules and contracts.

## Objectives

- Design note `apps/backend/docs/compliance-module-design.md`.
- Sub-modules under `apps/backend/src/modules/v1/compliance/{audit-query,phi-access,dpa-report,handoff-audit,boundary-violation}/` and `apps/backend/src/modules/v1/tenant-admin/{facility-config,shared-policies,cross-facility-reports,incident-ops}/`.
- Contract mirrors in `packages/contracts`.
- `tenant-admin.guard.ts` allowing `tenant_admin` and `system_admin`.

## Out of Scope

- Endpoint implementations.

## Dependencies

- SA-BE-01.

## Acceptance Criteria

- [ ] Design note committed.
- [ ] Skeletons compile.
- [ ] Guard rejects all non-tenant-admin/system-admin seed users.
- [ ] `pnpm --filter @repo/backend typecheck` passes.

## Verification

- **Automated check**: `pnpm --filter @repo/backend typecheck && pnpm --filter @repo/contracts typecheck`.
