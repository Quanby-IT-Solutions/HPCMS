# SA-FE-02 — Admin Design System: Data Tables, Wizards, Rule Builder Primitives

| Field | Value |
|-------|-------|
| Role  | System Admin |
| Layer | Frontend |
| Category | Frontend Design & UI/UX |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 1.2, 3.7, 5.5, 5.7, 12.6 · User Flows: A2, C6, E5, E7, L1 |
| Existing Code | `apps/web/core/components/ui/` (shadcn), `apps/web/core/styles/` |

## Scope

Build the reusable primitives that admin pages reuse: searchable/filterable data table, multi-step wizard, rule builder (condition + action), permission matrix grid, and tabbed settings shell. These ship as feature components under `features/staff-admin/components/` and use the existing shadcn library.

## Objectives

- Implement `<AdminDataTable>` with column config, server-side pagination, search, and per-row action menu — built on shadcn `Table`.
- Implement `<AdminWizard>` (numbered steps, step validation, "Back / Next / Finish") used by SA-FE-11.
- Implement `<RuleBuilder>` (field-operator-value condition rows + action selector) used by SA-FE-08.
- Implement `<PermissionMatrix>` (rows=permissions, cols=roles, cell=checkbox/radio) used by SA-FE-04.
- Implement `<SettingsTabs>` (vertical tabs with body slot) used by SA-FE-05 and SA-FE-10.

## Out of Scope

- Page wiring (covered by individual page tickets).
- Net-new shadcn primitive forks.

## Dependencies

- SA-FE-01.

## Acceptance Criteria

- [ ] All five components have a Storybook-equivalent demo on a `/admin/__design` route (gated to admins) showing every prop variant.
- [ ] `<AdminDataTable>` supports sort, filter, pagination via controlled props.
- [ ] `<AdminWizard>` blocks "Next" until current step's validator returns valid.
- [ ] `<RuleBuilder>` emits a typed `Rule` object via `onChange` (condition tree + action).
- [ ] `<PermissionMatrix>` toggles individual cells and emits a diff.
- [ ] All components pass `pnpm typecheck` with no `any` types.
- [ ] Tailwind `size-*` utility used for all square dimensions.

## Verification

- **Manual demo**: visit `/admin/__design`, exercise each component.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
