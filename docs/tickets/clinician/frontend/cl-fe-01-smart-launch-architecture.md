# CL-FE-01 — SMART on FHIR Launch Architecture & Iframe Constraints

| Field | Value |
|-------|-------|
| Role  | Clinician |
| Layer | Frontend |
| Category | Planning & Architecture |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 10.3, 10.4 · User Flows: J3, J4 · TOR: IR-04 |
| Existing Code | `apps/web/features/auth/`, `apps/web/services/better-auth/`, `packages/fhir/auth/` |

## Scope

Define the SMART on FHIR launch URL, OAuth flow, iframe-embedding constraints, route layout, and CSP/X-Frame-Options posture for the clinician sidebar. Establishes the route group and the auth handshake before any UI is built.

## Objectives

- Design note `apps/web/docs/clinician-smart-launch.md` covering: launch URL `/clinician/launch`, OAuth flow with Altera authorization server, expected scopes, redirect URI, and how the clinician session is established without a separate login.
- Configure CSP/X-Frame headers to allow embedding within `*.altera-sunrise.dev` (and configurable via env).
- Route group `apps/web/app/(clinician)/clinician/` with a minimal layout (no chrome, sidebar-friendly width).
- Session bridge that ingests the SMART launch token and creates a short-lived PCMS session with `clinician` role + patient context.
- Fallback page for direct (non-launch) access showing instructions.

## Dependencies

- SA-FE-01.

## Acceptance Criteria

- [ ] Design note committed.
- [ ] `/clinician/launch?iss=&launch=` accepts SMART launch params and starts OAuth.
- [ ] Successful launch creates a session with `clinician` role and selected patient in context.
- [ ] CSP allows embedding from configured EMR origins; blocks others.
- [ ] Direct visit shows fallback page.

## Verification

- **Manual demo**: simulate a launch via the dev stub server, observe sidebar load.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
