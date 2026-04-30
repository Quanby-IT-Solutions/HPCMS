# PAT-FE-02 — Patient-Friendly Design Tokens & Accessibility Baseline

| Field | Value |
|-------|-------|
| Role  | Patient |
| Layer | Frontend |
| Category | Frontend Design & UI/UX |
| Phase | TOR Phase 1 |
| Source Refs | TOR: NFR-05 |
| Existing Code | `apps/web/core/styles/`, `apps/web/core/components/ui/` |

## Scope

Establish the patient-portal design baseline: large readable type, high-contrast tokens, reduced-motion support, keyboard-navigable forms, and announce-on-error patterns. Build a small set of patient-tuned form primitives reusable across PAT-FE-03..PAT-FE-12.

## Objectives

- CSS variable set for portal: typography scale, spacing scale, color tokens (high contrast WCAG AA).
- `<PortalForm>`, `<PortalField>`, `<PortalUploadDropzone>`, `<PortalAlert>` primitives.
- Reduced-motion rules respected.
- Keyboard focus indicators visible.
- Showcase route `/portal/__design`.

## Dependencies

- PAT-FE-01.

## Acceptance Criteria

- [ ] Showcase renders all primitives.
- [ ] All interactive elements keyboard-reachable in tab order.
- [ ] Color contrast passes WCAG AA on showcase page (verifiable with axe).
- [ ] Tailwind `size-*` used.

## Verification

- **Manual demo**: visit `/portal/__design`, run axe audit.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
