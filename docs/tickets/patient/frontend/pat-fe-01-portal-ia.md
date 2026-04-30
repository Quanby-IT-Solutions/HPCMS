# PAT-FE-01 — Patient Portal IA, Route Groups & Public/Auth Boundaries

| Field | Value |
|-------|-------|
| Role  | Patient |
| Layer | Frontend |
| Category | Planning & Architecture |
| Phase | TOR Phase 1 |
| Source Refs | All Section F user stories |
| Existing Code | `apps/web/app/(portal)/`, `apps/web/features/auth/`, `apps/web/features/portal-loa/`, `portal-mrn-verify/`, `portal-my-requests/` |

## Scope

Define the patient portal IA: marketing/public pages, authenticated portal pages, route boundaries, and the patient-friendly layout shell. Scope what already exists and what to add.

## Objectives

- Inventory existing `(portal)` route group and `portal-loa`, `portal-mrn-verify`, `portal-my-requests` features.
- New layout `apps/web/app/(portal)/portal/layout.tsx` with patient-friendly shell (top header, simple footer, large readable typography).
- Auth guard `requirePatient()` redirecting to `/portal/login`.
- Public portal homepage at `/portal` (knowledge base + login CTA).
- Authenticated dashboard at `/portal/dashboard`.
- Route constants in `features/portal-loa/lib/portal-routes.ts`.

## Dependencies

- None (foundational).

## Acceptance Criteria

- [ ] `/portal` accessible without login; renders public landing.
- [ ] `/portal/dashboard` requires authentication.
- [ ] Logging in as `patient@hpcms.local` opens the dashboard.
- [ ] Logging in as a non-patient role and visiting `/portal/dashboard` redirects to that role's home.
- [ ] Layout uses patient-friendly typography (≥ 16px base).

## Verification

- **Manual demo**: visit `/portal`, then log in as Maria Santos, see dashboard.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
