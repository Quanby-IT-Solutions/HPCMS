# SUP-FE-02 — Patient Profile Shell, Case Detail Shell, Panel Patterns

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Frontend |
| Category | Frontend Design & UI/UX |
| Phase | TOR Phase 1 |
| Source Refs | Sections B, C, H, J, K |
| Existing Code | `apps/web/features/staff-case-detail/`, `core/components/ui/` |

## Scope

Build the reusable shells used by Patient Profile and Case Detail across multiple roles: tabbed layout with header, primary panel area, and right-rail panels (consent, programs, devices, FHIR sync, etc.). Establish the panel pattern (collapsible card with header / body / footer slots).

## Objectives

- `<PatientProfileShell>` with header (name, MRN, demographics summary, EMR link badge), tabs (Overview, Communications, Cases, Programs, Devices, Audit, Consent), right-rail slot.
- `<CaseDetailShell>` with header (case id, status, priority, SLA timer), tabs (Overview, Communications, Notes, Linked, Claims), right-rail slot.
- `<RightRailPanel>` collapsible card with consistent typography, action button, and loading state.
- Showcase route `/supervisor/__design`.

## Out of Scope

- Concrete panel content (separate tickets).

## Dependencies

- SUP-FE-01.

## Acceptance Criteria

- [ ] Shells render with placeholder slots for tabs and rail panels.
- [ ] Showcase page demos each shell variant.
- [ ] Components type-safe; right-rail panels collapse persistently per user.
- [ ] Tailwind `size-*` used for square dimensions.

## Verification

- **Manual demo**: visit `/supervisor/__design`.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
