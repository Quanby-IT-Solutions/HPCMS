# SUP-FE-20 — Cross-Facility Patient Context Panel & Access Request

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 12.7 · User Flows: L6 · TOR: SC-04 |
| Existing Code | SUP-FE-04, SA-BE-05 |

## Scope

Right-rail Cross-Facility Patient Context Panel on Patient Profile shown when the patient has records at multiple facilities. Supports request-access flow when the Supervisor lacks cross-facility permission.

## Objectives

- `<CrossFacilityPatientContextPanel>` listing facilities with case counts and last-interaction dates.
- "View Cases" link gated by access level (Full / Read-Only / None).
- "Request Access" opens a Multi-Tenant Access Request Form (justification, requested level).
- Notification on request approval/denial.

## Dependencies

- SUP-FE-04, SA-BE-05, TA-BE-09.

## Acceptance Criteria

- [ ] Panel only renders when the patient has multi-facility records.
- [ ] Hidden case counts shown with lock icon when access is None.
- [ ] Request Access form persists and notifies System Admin.
- [ ] Approval grants temporary access reflected in the next session.

## Verification

- **Manual demo**: with a patient registered at two seeded tenants, log in as `supervisor@hpcms.local` lacking cross-facility flag, observe the panel and request access.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
