# MOB-PAT-01 — Mobile App Architecture, Navigation & Auth Bridge

| Field | Value |
|-------|-------|
| Role  | Patient (mobile) |
| Layer | Mobile (Flutter) |
| Category | Planning & Architecture |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 6.1, 6.2, 6.11 · User Flows: F1, F2, F7 · TOR: FR-04 |
| Existing Code | `apps/mobile/lib/features/auth/`, `lib/core/navigation/`, `lib/core/theme/`, `lib/services/api/`, PAT-BE-02, PAT-BE-03 |

## Scope

Define IA, route map, theming baseline, and the API + auth bridge that connects the existing Flutter scaffold (`apps/mobile/`) to the patient self-service backend (PAT-BE-* APIs). Establishes the auth client, secure token storage, and the navigation shell every other MOB-PAT-* ticket consumes.

## Objectives

- Decide route map under `lib/core/navigation/`: `/onboarding`, `/auth/login`, `/auth/register`, `/auth/verify-email`, `/auth/password-reset`, `/auth/mfa`, `/dashboard`, `/loa/new`, `/requests`, `/requests/:id`, `/kb`, `/kb/:slug`, `/chatbot`, `/chat/:threadId`, `/notifications`.
- Build `ApiClient` in `lib/services/api/` calling `apps/backend` endpoints with `Authorization` from secure storage.
- Build `AuthService` in `lib/services/auth/` wrapping Better Auth-compatible session creation; persist tokens via `flutter_secure_storage`.
- Define theme tokens in `lib/core/theme/` matching PAT-FE-02 (large readable type, AA contrast).
- Riverpod root providers: `apiClientProvider`, `authStateProvider`, `currentPatientProvider`.

## Out of Scope

- Page bodies (covered by MOB-PAT-02..07).
- Push notifications transport (MOB-PAT-06).

## Dependencies

- PAT-BE-02, PAT-BE-03.

## Acceptance Criteria

- [ ] All route stubs exist and are reachable via deep link.
- [ ] `ApiClient` successfully calls `/api/v1/health` on the running backend with bearer token attached.
- [ ] `AuthService.signIn` creates a session and persists the token in secure storage.
- [ ] `AuthService.signOut` clears token and routes back to `/auth/login`.
- [ ] Theme tokens render at WCAG AA contrast on light and dark mode.
- [ ] Riverpod providers expose typed states with no `dynamic`.
- [ ] `flutter analyze` and `flutter test` pass.

## Verification

- **Manual demo**: launch the mobile app on iOS or Android simulator, log in with `patient@hpcms.local` / `DevPass123!`, observe dashboard route reached.
- **Automated check**: `cd apps/mobile && flutter analyze && flutter test`.
