# MOB-PAT-02 — Mobile Auth Flows (Register / Verify / Login + Biometric MFA / Reset)

| Field | Value |
|-------|-------|
| Role  | Patient (mobile) |
| Layer | Mobile (Flutter) |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 6.1, 6.2, 6.11 · User Flows: F1, F2, F7 · TOR: FR-04, SC-02 |
| Existing Code | `apps/mobile/lib/features/auth/`, MOB-PAT-01, PAT-BE-02, PAT-BE-03 |

## Scope

Native screens covering registration, email verification deep link, login with optional biometric MFA (Face ID / Touch ID / Android biometrics), and password reset. Mirrors PAT-FE-03..05 but uses platform biometrics for the "second factor" where available.

## Objectives

- `RegisterScreen` (`/auth/register`) with full name, email, DOB, mobile phone, password, T&C consent.
- `EmailVerificationScreen` (`/auth/verify-email`) handling deep link `pcms://verify?token=`.
- `LoginScreen` (`/auth/login`) with email + password and "Forgot password?" link.
- Optional biometric MFA — TOTP fallback when biometrics unavailable; uses `local_auth` package.
- `PasswordResetScreen` flow: email entry → identity verification (DOB + mobile OTP) → new password.
- Inline validation; secure error messaging that never leaks account existence.
- Native keyboard types for email / phone / numeric OTP.

## Out of Scope

- Backend registration / reset endpoints (PAT-BE-02, PAT-BE-03).

## Dependencies

- MOB-PAT-01, PAT-BE-02, PAT-BE-03.

## Acceptance Criteria

- [ ] Register screen successfully creates an account via `portal.auth.register`.
- [ ] Verification deep link activates the account.
- [ ] Login with valid credentials lands on `/dashboard`.
- [ ] Biometric prompt appears when device has biometrics enrolled and the user opted in.
- [ ] Password reset flow completes end-to-end against PAT-BE-03.
- [ ] All inputs use correct native keyboard types.
- [ ] Tested on both iOS and Android simulators.

## Verification

- **Manual demo**: run on simulator, register a fresh patient, confirm verification email opens app, log in with biometric prompt.
- **Automated check**: `cd apps/mobile && flutter analyze && flutter test integration_test/auth_flow_test.dart`.
