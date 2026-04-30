# SA-BE-10 — Tenant Onboarding Wizard API (Orchestrated Provisioning)

| Field | Value |
|-------|-------|
| Role  | System Admin |
| Layer | Backend |
| Category | Integration & API Connectivity |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 12.6 · User Flows: L1 · TOR: SC-04 |
| Existing Code | `packages/db/schema/tenancy.ts`, existing modules: `staff-admin/tenants`, `case-types`, `notifications` |

## Scope

Expose endpoints supporting the five-step Facility Setup Wizard from SA-FE-11 plus a single "Activate" endpoint that orchestrates the full provisioning in one transaction.

## Objectives

- Endpoint: `staff-admin.tenants.draft.create` and `staff-admin.tenants.draft.update` so the wizard can save partial state per step (or hold state in client memory — implementer's choice; document the decision).
- Endpoint: `staff-admin.tenants.activate` accepting the full payload (identity, default settings, departments, initial admin user) and creating: tenant row, default case types (clones from system catalog), department rows, initial Tenant Admin user with activation email.
- Wrap activation in a transaction; rollback on any failure.
- Audit each provisioning step.

## Out of Scope

- Cross-tenant policy creation (TA-BE-07).

## Dependencies

- SA-BE-01, SA-BE-02, SA-BE-05, SA-BE-06.

## Acceptance Criteria

- [ ] `tenants.activate` creates the tenant, departments, default case types, and initial admin atomically.
- [ ] Failure mid-activation rolls back fully (no orphan tenant rows).
- [ ] Initial admin receives an activation email.
- [ ] New tenant appears in `staff-admin.tenants.list`.
- [ ] Audit log shows the provisioning sequence.

## Verification

- **Manual demo**: SA-FE-11 → onboard "SLMC BGC", confirm via SA-FE-06 the tenant and admin exist.
- **Automated check**: `pnpm --filter @repo/backend test tenant-onboarding && pnpm --filter @repo/backend typecheck`.
