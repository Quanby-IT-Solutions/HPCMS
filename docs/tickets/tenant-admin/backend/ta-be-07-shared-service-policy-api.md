# TA-BE-07 — Shared Service Policy API

| Field | Value |
|-------|-------|
| Role  | Tenant Admin |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 12.3 · User Flows: L4 · TOR: SC-04 |
| Existing Code | `apps/backend/src/common/tenancy/`, SA-BE-05 |

## Scope

Persist cross-tenant shared service policies with participating tenants, allowed roles, and access level. Tenancy middleware consults policies to relax cross-tenant restrictions when applicable.

## Objectives

- Schema: `shared_service_policies` (id, service_name, participating_tenants jsonb, role_scopes jsonb, access_level enum, justification, created_by).
- Endpoints: `tenantAdmin.sharedPolicies.*` (CRUD).
- Tenancy middleware extension: when policy matches the requested action, log it and allow.
- Audit changes and policy invocations.

## Dependencies

- TA-BE-01, SA-BE-05.

## Acceptance Criteria

- [ ] Migrations create the table.
- [ ] Adding a policy spanning two tenants permits the listed role(s) to operate on the named service across both.
- [ ] Each invocation appears in the audit log with policy reference.
- [ ] Removing a policy revokes the cross-tenant access immediately.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test shared-policies && pnpm --filter @repo/backend typecheck`.
