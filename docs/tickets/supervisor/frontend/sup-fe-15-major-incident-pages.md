# SUP-FE-15 — Major Incident Creation, Detail & Status Pages

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 3 |
| Source Refs | User Stories: 7.1–7.6, 7.8 · User Flows: G1, G2, G3, G4 · TOR: FR-05 |
| Existing Code | SUP-FE-01, SUP-FE-02 |

## Scope

Multi-page incident workflow: list, create, detail (with severity, status, scope, root cause), and case-aggregation linking. Tenant Admin's `/tenant-admin/incidents` (TA-FE-08) drills in here.

## Objectives

- `/supervisor/incidents` list with KPI strip and table.
- `/supervisor/incidents/new` Incident Creation Form: title, description, severity, initial status "Detected", Case Aggregation Selector (multi-case search).
- `/supervisor/incidents/[id]` Detail Page: header (severity badge, status indicator), Affected Scope Panel (departments, cohorts, systems), Severity/Status Update form, Root Cause Notes Panel, Resolution Documentation Form, Incident Status Timeline, attached cases list with link/unlink actions.
- "Add Case" search modal to attach more cases over time.

## Out of Scope

- Cross-tenant incident view (TA-FE-08).

## Dependencies

- SUP-FE-01, SUP-FE-02, SUP-BE-08.

## Acceptance Criteria

- [ ] List page renders empty state initially.
- [ ] Creation form requires ≥ 2 attached cases.
- [ ] Detail page shows all panels and updates in real time.
- [ ] Severity / status updates appear in the Status Timeline.
- [ ] Root cause + resolution forms persist with timestamps.
- [ ] Linking a case adds the incident reference to that case's detail.

## Verification

- **Manual demo**: log in as `supervisor@hpcms.local`, create incident, update severity, add resolution.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
