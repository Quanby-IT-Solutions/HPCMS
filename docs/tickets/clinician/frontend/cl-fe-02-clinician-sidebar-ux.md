# CL-FE-02 — Clinician Sidebar UX Patterns (Compact, Read-Optimized)

| Field | Value |
|-------|-------|
| Role  | Clinician |
| Layer | Frontend |
| Category | Frontend Design & UI/UX |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 10.4 · User Flows: J4 |
| Existing Code | `apps/web/core/components/ui/`, CL-FE-01 |

## Scope

Reusable primitives for an iframe-embedded sidebar: compact patient header, collapsible card sections, dense info rows, sticky header, and a "Pop out" link to open full PCMS in a new tab.

## Objectives

- `<ClinicianHeader>` (patient name, MRN, age, sex, allergy chip).
- `<ClinicianCard>` collapsible card with header + body + last-synced timestamp.
- `<DenseInfoRow>` (label / value / optional sub-row) for clinical data.
- `<PopOutLink>` rendering the full PCMS URL with current case context.
- Showcase route `/clinician/__design`.

## Dependencies

- CL-FE-01.

## Acceptance Criteria

- [ ] Showcase renders all primitives at 360px and 480px widths.
- [ ] Tailwind `size-*` used.
- [ ] Components type-safe with no `any`.

## Verification

- **Manual demo**: visit `/clinician/__design` at sidebar widths.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
