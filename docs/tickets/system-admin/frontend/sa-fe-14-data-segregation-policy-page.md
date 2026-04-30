# SA-FE-14 — Data Segregation Policy Page

| Field | Value |
|-------|-------|
| Role  | System Admin |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 12.1 · TOR: SC-04 |
| Existing Code | `apps/web/features/staff-admin/`, SA-FE-06 (Tenant Configuration), TA-FE-10 (Shared Service Policy) |

## Scope

Single source-of-truth page that visualises the data segregation policy applied to each sensitive entity type (Patient, Case, Communication, Claim, Attachment, Audit Event) per tenant pair. Read-mostly view that documents which entities are isolated, which can be shared via policy, and which are intentionally tenant-shared. Mutations route into existing pages (SA-FE-06 for tenant assignment, TA-FE-10 for shared-service policies).

## Objectives

- Page at `/admin/security/data-segregation` rendering a policy matrix:
 - Rows: entity type (Patient / Case / Communication / Claim / Attachment / Consent / Audit Event).
 - Columns: tenant pairs (e.g., "QC ↔ BGC").
 - Cell: segregation level — `Isolated` / `Shared via Policy` / `Fully Shared` — with policy reference link when applicable.
- Per-cell click opens a side drawer with: current rule, justification, last reviewed date, "Edit in Tenant Configuration" CTA (deep-link to SA-FE-06) or "Edit in Shared Policies" CTA (deep-link to TA-FE-10).
- Top banner summary: total isolated / shared / cross counts and last-reviewed timestamp.
- Export current policy matrix to PDF for compliance evidence.
- Inaccessible to all non-admin seed users.

## Out of Scope

- Actually editing tenant assignments (SA-FE-06).
- Actually editing shared-service policies (TA-FE-10).
- Backend enforcement (SA-BE-05, TA-BE-07, TA-BE-09).

## Dependencies

- SA-FE-01, SA-FE-06, TA-FE-10, SA-BE-05, TA-BE-07.

## Acceptance Criteria

- [ ] `/admin/security/data-segregation` renders the matrix for the seeded tenant.
- [ ] Each cell shows the correct segregation level computed from current SA-BE-05 + TA-BE-07 state.
- [ ] Drawer "Edit" CTAs navigate to the correct upstream page with the relevant tenant/entity preselected.
- [ ] PDF export downloads the policy matrix with a generation timestamp.
- [ ] Page reflects updates after editing in SA-FE-06 / TA-FE-10 without manual refresh delay > 30s.
- [ ] Inaccessible to Tenant Admin / Supervisor / Case Agent / Clinician / Patient seed users.

## Verification

- **Manual demo**: log in as `system@hpcms.local`, visit `/admin/security/data-segregation`, click a Patient × QC↔BGC cell, follow the "Edit" CTA, return and observe updated state.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
