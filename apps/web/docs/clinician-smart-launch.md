# Clinician SMART on FHIR Launch — Architecture

> **Status:** design note for CL-FE-01. Implementation lives in `apps/web/app/(clinician)/` and `apps/web/features/clinician-launch/`.

## Goal

Embed PCMS as a compact sidebar inside Altera Sunrise (or any SMART on FHIR EMR) when a clinician opens a patient chart. The clinician should not log in separately — the EMR's SMART launch hands us an authorization grant that we exchange for a short-lived PCMS session scoped to the launched patient.

## Launch URL

```
GET /clinician/launch?iss=<EMR FHIR base>&launch=<EMR launch token>
```

The EMR redirects the embedded iframe (or a popup) to this URL. We accept the two SMART launch query parameters and start an OAuth 2.0 authorization-code flow with PKCE.

## OAuth flow

1. **Discovery** — `GET ${iss}/.well-known/smart-configuration` to read `authorization_endpoint` and `token_endpoint`.
2. **Authorization request** — generate PKCE pair (`code_verifier`, `code_challenge`); redirect the iframe to `authorization_endpoint?response_type=code&client_id=${NEXT_PUBLIC_SMART_CLIENT_ID}&redirect_uri=${NEXT_PUBLIC_SMART_REDIRECT_URI}&scope=${NEXT_PUBLIC_SMART_SCOPES}&state=<csrf>&aud=${iss}&launch=<launch>&code_challenge=<...>&code_challenge_method=S256`.
3. **Callback** — the EMR authorization server redirects back to `/clinician/callback?code=...&state=...`.
4. **Token exchange** — Server Action posts `code` + `code_verifier` to the PCMS backend (`POST /api/v1/clinician/launch/validate`, owned by CL-BE-02). The backend exchanges with the EMR token endpoint, validates the `aud`/`iss`/`launch` claims, fetches patient context, and returns a Better Auth session cookie scoped to the `clinician` role.
5. **Session bridge** — the callback page sets the returned cookie and redirects to `/clinician/sidebar/${patientId}`.

The frontend never sees the EMR access token directly — it stays on the backend in a short-lived encrypted store keyed by PCMS session id. This avoids exposing PHI-bearing tokens to the iframe and keeps token refresh server-side.

## Scopes

Default `NEXT_PUBLIC_SMART_SCOPES`:

```
launch openid fhirUser patient/*.read
```

This lets the backend read all FHIR resources for the launched patient (used by CL-BE-05 for the Clinical Context tab).

## Iframe & CSP posture

- `Content-Security-Policy: frame-ancestors <NEXT_PUBLIC_EMR_FRAME_ORIGINS>` is set only on `/clinician/*` routes — every other route stays `frame-ancestors 'none'`.
- `NEXT_PUBLIC_EMR_FRAME_ORIGINS` is a CSV. Default in `.env.example`: `http://localhost:* https://*.altera-sunrise.dev`.
- `X-Frame-Options` is **omitted** under `/clinician/*`. (Browsers prefer CSP over the legacy header, and the legacy header doesn't support multiple origins.)
- The middleware exempts `/clinician/*` from the regular session-redirect logic; the launch flow establishes the session via the callback, not `/login`.

## Direct access fallback

`/clinician` (no params) renders a static page explaining "This sidebar must be launched from your EMR." The `launch` and `callback` pages each render error states if their required params are missing.

## Local development

A dev stub server simulates `iss` and `launch`:

```bash
# Until CL-BE-02 lands, the callback page posts to a local Route Handler at
# /clinician/api/dev-validate that returns a stub session and patient ID.
NEXT_PUBLIC_SMART_CLIENT_ID=pcms-dev
NEXT_PUBLIC_SMART_REDIRECT_URI=http://localhost:3001/clinician/callback
NEXT_PUBLIC_SMART_SCOPES="launch openid fhirUser patient/*.read"
NEXT_PUBLIC_EMR_FRAME_ORIGINS="http://localhost:*,https://*.altera-sunrise.dev"
```

Visit `/clinician/launch?iss=http://localhost:4444/fhir&launch=stub` to drive the full flow against the stub.

## Security notes

- `state` is a single-use CSRF token bound to the session cookie; the callback rejects mismatches.
- `code_verifier` is stored in an `httpOnly`, `SameSite=None; Secure` cookie scoped to `/clinician/callback` so the browser doesn't expose it to JS.
- All clinician sessions expire after 60 minutes; refresh requires a new launch.
- The CSP `frame-ancestors` directive is the only non-trivial relaxation; all other security headers stay at the application defaults.
