# SA-FE-12 — Admin oRPC Client Wiring & Permission-Aware Mutations

| Field | Value |
|-------|-------|
| Role  | System Admin |
| Layer | Frontend |
| Category | Integration & API Connectivity |
| Phase | TOR Phase 1 |
| Source Refs | All admin user stories (1.x, 3.7, 5.5, 5.7, 10.7, 10.8, 12.6) |
| Existing Code | `apps/web/services/orpc/client.ts`, `services/orpc/orpc-server.ts`, `services/tanstack-query/`, `@repo/contracts` |

## Scope

Wire all admin pages to the backend via the existing oRPC client and TanStack Query setup. Add permission-aware mutation helpers that surface 403s as inline error toasts and re-route on session expiry. Establishes the query/mutation hooks file `features/staff-admin/api/admin.hooks.ts` consumed by SA-FE-03..SA-FE-11.

## Objectives

- Add `features/staff-admin/api/admin.hooks.ts` exporting `useAdminUsers*`, `useRolePermissions*`, `useSecurityPolicy*`, `useTenants*`, `useCaseTypes*`, `useRoutingRules*`, `useAITriage*`, `useFhirSettings*` hooks.
- Each hook uses `orpc.<module>.<endpoint>.queryOptions()` / `.mutationOptions()`.
- Add a thin `<AdminMutationToaster>` wrapper that converts mutation errors to toasts and on 403 redirects to `/dashboard`.
- Add session-expiry interceptor that re-prompts login.
- Document hook usage in JSDoc.

## Out of Scope

- Backend endpoints (covered by SA-BE-* tickets).
- Non-admin oRPC hooks.

## Dependencies

- SA-FE-01 plus all SA-BE tickets.

## Acceptance Criteria

- [ ] All admin pages call exported hooks (no direct `fetch` or `orpc.*` calls in components).
- [ ] On a 403 response, the user sees a toast and is redirected.
- [ ] On a session expiry response, the user is sent to `/login`.
- [ ] Mutations invalidate the corresponding queries (e.g., `useDeactivateUser` invalidates `useAdminUsers`).
- [ ] Hooks pass typecheck with no `any` and no TODO type assertions.
- [ ] Smoke test (`apps/web/__tests__/admin-hooks.test.ts`) verifies hook exports exist.

## Verification

- **Manual demo**: with `system@hpcms.local` session expired (force-deleted), visit `/admin/users` and confirm redirect to `/login`.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint && pnpm --filter @repo/web test admin-hooks`.
