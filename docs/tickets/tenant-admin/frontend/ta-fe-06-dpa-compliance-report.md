# TA-FE-06 — DPA Compliance Dashboard & Report

| Field | Value |
|-------|-------|
| Role  | Tenant Admin |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 11.6 · User Flows: K5 · TOR: SC-01 |
| Existing Code | TA-FE-02, `apps/backend/src/common/audit/` |

## Scope

Compliance dashboard showing DPA (RA 10173) coverage metrics plus a generator for the periodic DPA Compliance Summary Report consumed by the hospital's Data Privacy Officer.

## Objectives

- Dashboard `/tenant-admin/compliance` with KPI cards (Consent coverage %, PHI access events, Audit completeness %, Outstanding consent gaps).
- "Generate DPA Report" action opens a parameter modal (reporting period) and renders a printable report at `/tenant-admin/compliance/dpa`.
- Report sections: consent coverage, PHI access summary, audit completeness, list of patients without consent on file.
- Narrative-note field appended to the export.
- Export PDF and email-to-DPO option.

## Out of Scope

- JCI handoff (TA-FE-07).

## Dependencies

- TA-FE-01, TA-FE-02, TA-BE-04.

## Acceptance Criteria

- [ ] Dashboard KPIs show numeric values from seeded data.
- [ ] DPA report renders all four sections with non-empty content.
- [ ] PDF export downloads the report.
- [ ] "Email to DPO" sends an email when configured.
- [ ] Inaccessible to non-admin users.

## Verification

- **Manual demo**: log in as `admin@hpcms.local`, generate Q1 DPA report, download PDF.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
