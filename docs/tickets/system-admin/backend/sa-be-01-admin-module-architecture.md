# SA-BE-01 — Admin Module Architecture & Contract Layout

| Field | Value |
|-------|-------|
| Role  | System Admin |
| Layer | Backend |
| Category | Planning & Architecture |
| Phase | TOR Phase 1 |
| Source Refs | All admin user stories |
| Existing Code | `apps/backend/src/modules/v1/staff-admin/`, `packages/contracts/src/modules/v1/`, `apps/backend/src/common/orpc/` |

## Scope

Define the directory structure, NestJS module boundaries, and oRPC contract layout for all System Admin functionality. Decides whether to extend `staff-admin` or split into a dedicated `admin/` module group. Outputs an ADR-style design note plus skeleton modules so SA-BE-02..SA-BE-10 can implement against a stable shape.

## Objectives

- Add a design note `apps/backend/docs/admin-module-design.md` capturing the chosen module layout (recommended: split into `staff-admin/users`, `staff-admin/roles`, `staff-admin/security`, `staff-admin/tenants`, `staff-admin/case-types`, `staff-admin/routing-rules`, `staff-admin/ai-triage`, `staff-admin/fhir-settings`).
- Add empty `*.module.ts`, `*.controller.ts`, `*.service.ts` skeletons for each sub-module.
- Mirror the structure in `packages/contracts/src/modules/v1/staff-admin/` with `[topic].contract.ts` files containing empty Zod schemas and DTOs.
- Wire each new module into `apps/backend/src/modules/v1/app.module.ts`.
- Add a `system-admin.guard.ts` in `apps/backend/src/shared/guards/` that rejects non-`system_admin` requests.

## Out of Scope

- Endpoint implementations (SA-BE-02..SA-BE-10).
- Database migrations (per-feature tickets).

## Dependencies

- None.

## Acceptance Criteria

- [ ] Design note committed and reviewed.
- [ ] Sub-module skeletons compile and can be imported in `app.module.ts`.
- [ ] Empty contracts compile and re-export from `@repo/contracts`.
- [ ] `system-admin.guard.ts` rejects with 403 when used on a route accessed by non-admin seed users.
- [ ] `pnpm --filter @repo/backend typecheck` passes.
- [ ] `pnpm --filter @repo/contracts typecheck` passes.

## Verification

- **Manual demo**: hit any guarded route with a non-admin session, expect 403.
- **Automated check**: `pnpm --filter @repo/backend typecheck && pnpm --filter @repo/contracts typecheck && pnpm --filter @repo/backend lint`.
