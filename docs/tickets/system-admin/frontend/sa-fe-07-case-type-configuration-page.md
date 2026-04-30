# SA-FE-07 — Case Type Configuration Page

| Field | Value |
|-------|-------|
| Role  | System Admin |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 3.7 · User Flows: C6 · TOR: NFR-03 |
| Existing Code | `apps/web/features/staff-admin/`, `apps/backend/src/modules/v1/cases/` |

## Scope

Page where the System Admin lists and configures case types (LOA Request, Billing Inquiry, Complaint, Care Coordination, Drug Program Enrollment, etc.) without code changes. Each case type defines name, default priority, SLA threshold, default team, required/optional fields shown on the New Case Form, and routing rules. Backed by SA-BE-06.

## Objectives

- Page at `/admin/case-types` listing all case types via `<AdminDataTable>` (name, default priority, SLA hours, default team, status).
- "Add Case Type" and per-row "Edit" open a configuration form: name, description, default priority, SLA threshold (hours), default team, required-field selector, optional-field selector, default routing rule.
- Archive (soft-deactivate) and reactivate actions per row.
- Field selectors enumerate the patient/case schema fields available to expose on the New Case Form.

## Out of Scope

- The New Case Form itself (SUP-FE-08).
- Routing rule definition (SA-FE-08).

## Dependencies

- SA-FE-01, SA-FE-02, SA-BE-06.

## Acceptance Criteria

- [ ] `/admin/case-types` lists at least the seeded LOA Request case type.
- [ ] Adding a new case type makes it appear in the New Case Form selector for Supervisors and Case Agents.
- [ ] Editing an existing type updates the configuration without disrupting existing cases.
- [ ] Archived case types are hidden from the New Case Form selector but remain visible on existing cases.
- [ ] Form validates required fields and SLA-hours range.
- [ ] Page is inaccessible to all non-admin seed users.

## Verification

- **Manual demo**: log in as `system@hpcms.local`, create a "Care Coordination" case type, log in as `supervisor@hpcms.local`, open New Case Form, confirm new type appears.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
