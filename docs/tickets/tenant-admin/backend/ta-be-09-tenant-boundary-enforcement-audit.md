# TA-BE-09 — Tenant Boundary Enforcement Audit Hook

| Field | Value |
|-------|-------|
| Role  | Tenant Admin |
| Layer | Backend |
| Category | Integration & API Connectivity |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 12.8 · TOR: SC-04 |
| Existing Code | `apps/backend/src/common/tenancy/`, `apps/backend/src/common/audit/`, SA-BE-05, TA-BE-07 |

## Scope

Tap into the tenancy middleware so every cross-tenant access (allowed via shared policy or denied) produces a flagged audit event, and expose query endpoints for the violation report (TA-FE-12).

## Objectives

- Tenancy middleware emits a `tenant_boundary` audit event with `outcome` ∈ {`blocked`, `allowed_with_policy`}.
- Endpoint: `compliance.boundaryViolations.list` (filters + pagination).
- Endpoint: `compliance.boundaryViolations.kpis` (today, last 7d, distinct users).
- Endpoint: `compliance.boundaryViolations.export`.

## Dependencies

- SA-BE-05, TA-BE-02, TA-BE-07.

## Acceptance Criteria

- [ ] Cross-tenant attempt by a user without policy is logged with `blocked` outcome.
- [ ] Allowed cross-tenant access via shared policy is logged with `allowed_with_policy` and policy id.
- [ ] List endpoint returns these events scoped by tenant.
- [ ] KPIs match list counts.
- [ ] Permission `audit.view` required.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test boundary-violations && pnpm --filter @repo/backend typecheck`.
