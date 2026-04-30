# SA-FE-11 — New Facility Setup Wizard

| Field | Value |
|-------|-------|
| Role  | System Admin |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 12.6 · User Flows: L1 · TOR: SC-04 |
| Existing Code | `apps/web/features/staff-admin/`, `<AdminWizard>` from SA-FE-02, `packages/db/schema/tenancy.ts` |

## Scope

Five-step wizard that provisions a new tenant/facility. Steps: Identity → Default Settings → Department Setup → Initial User Provisioning → Review & Activate. Backed by SA-BE-10.

## Objectives

- Page at `/admin/tenants/new` rendering `<AdminWizard>`.
- Step 1 — Identity: facility name, short code, address, contact info.
- Step 2 — Default Settings: default case types (multi-select from SA-FE-07), SLA thresholds, notification template selector.
- Step 3 — Departments: list editor (add/edit/remove department names + care teams).
- Step 4 — Initial User Provisioning: optional first Tenant Admin (email, full name).
- Step 5 — Review & Activate: read-only summary; "Activate Facility" submits.

## Out of Scope

- Cross-tenant policies (TA-FE-10).
- Per-step validation backend (SA-BE-10).

## Dependencies

- SA-FE-01, SA-FE-02, SA-BE-10.

## Acceptance Criteria

- [ ] `/admin/tenants/new` renders all five steps in sequence.
- [ ] "Next" disabled until current step's required fields validate.
- [ ] Activating creates the tenant, default settings, departments, and initial admin user (if provided) in a single transaction.
- [ ] After activation, the new facility appears in `/admin/tenants` list.
- [ ] Initial admin user receives an activation email.
- [ ] Wizard supports "Back" without data loss.

## Verification

- **Manual demo**: log in as `system@hpcms.local`, create "SLMC BGC" facility, complete all steps, verify it appears in `/admin/tenants`.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
