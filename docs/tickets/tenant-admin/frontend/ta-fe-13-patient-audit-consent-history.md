# TA-FE-13 — Patient Audit History & Consent History Panels

| Field | Value |
|-------|-------|
| Role  | Tenant Admin |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 2.9, 11.3 · TOR: SC-01 |
| Existing Code | `apps/web/features/staff-admin/`, TA-FE-02 |

## Scope

Two read-only panels surfaced inside the existing Patient Profile (built in SUP-FE-04). When viewed by a Tenant Admin, the Patient Profile renders an Audit History tab and a Consent History tab. This ticket builds those panels.

## Objectives

- Implement `<PatientAuditHistoryPanel>` listing every change to the patient master record (field, before, after, actor, timestamp).
- Implement `<ConsentHistoryPanel>` listing every consent grant, modification, withdrawal (category, status, method, actor, timestamp, optional document download).
- Both surface in `/staff/patients/[id]` only when role = `tenant_admin` or `system_admin`.
- Include filter (date range) and CSV export per panel.

## Out of Scope

- Consent recording UI (SUP-FE-06).

## Dependencies

- TA-FE-01, TA-FE-02, SUP-FE-04, TA-BE-02, SUP-BE-12.

## Acceptance Criteria

- [ ] Tabs visible when logged in as Tenant Admin; hidden for Case Agent.
- [ ] Audit panel lists every change to the seeded patient.
- [ ] Consent panel lists every consent event with method.
- [ ] CSV export works on both panels.
- [ ] Document download works for any uploaded consent attachment.

## Verification

- **Manual demo**: as `admin@hpcms.local`, open Maria Santos's profile, switch to Audit and Consent tabs.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
