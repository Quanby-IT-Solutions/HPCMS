# CL-FE-03 — SMART Launch Entry Point Page

| Field | Value |
|-------|-------|
| Role  | Clinician |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 10.3 · User Flows: J3 · TOR: IR-04 |
| Existing Code | CL-FE-01, `packages/fhir/auth/oauth-client-credentials.ts` |

## Scope

The actual implementation of `/clinician/launch` and the post-OAuth callback that hands off into the sidebar.

## Objectives

- Page at `/clinician/launch` accepting `iss` and `launch` query params.
- Initiate OAuth authorization redirect with PKCE and configured scopes.
- Callback at `/clinician/callback` exchanges code for token, fetches patient context, creates PCMS session, and redirects to `/clinician/sidebar/[patientId]`.
- Loading and error states with branded messaging.
- "Patient not in PCMS" path → CL-FE-04 prompt to create or link.

## Dependencies

- CL-FE-01, CL-BE-02.

## Acceptance Criteria

- [ ] Launch URL accepts SMART params and redirects to authorization server.
- [ ] Callback exchanges and redirects to sidebar.
- [ ] Error states show actionable messages.
- [ ] Inaccessible without launch params (fallback).

## Verification

- **Manual demo**: simulate launch via dev stub, complete OAuth flow.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
