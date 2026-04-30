# TA-FE-09 — Facility Configuration Page (SLA / Notifications / Departments)

| Field | Value |
|-------|-------|
| Role  | Tenant Admin |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 12.5 · User Flows: L3 |
| Existing Code | TA-FE-02, `apps/backend/src/common/templates/`, `packages/db/schema/templates.ts` |

## Scope

Tabbed page where the Tenant Admin tunes SLA thresholds, notification templates, and department lists for their facility independently from other tenants.

## Objectives

- Page at `/tenant-admin/facility` using `<SettingsTabs>` with SLA Settings, Notification Templates, Departments, Routing Defaults tabs.
- **SLA Settings**: table of case types × {response time, resolution time} editable inline.
- **Notification Templates**: template selector (LOA confirmation, case closure, escalation), rich-text editor, variable picker (`{{patient.name}}`, etc.), preview pane.
- **Departments**: list editor with add/edit/deactivate.
- **Routing Defaults**: facility-level default rules referencing the global SA-FE-08 rules.

## Out of Scope

- Cross-tenant policies (TA-FE-10).
- Routing rule definition (SA-FE-08).

## Dependencies

- TA-FE-01, TA-FE-02, TA-BE-06.

## Acceptance Criteria

- [ ] All four tabs render and save independently.
- [ ] SLA changes apply to subsequently created cases.
- [ ] Notification template preview substitutes variables.
- [ ] Adding a department makes it selectable in case-creation flows.
- [ ] Settings are tenant-scoped.

## Verification

- **Manual demo**: log in as `admin@hpcms.local`, set LOA SLA = 48h, edit LOA confirmation template, add a department.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
