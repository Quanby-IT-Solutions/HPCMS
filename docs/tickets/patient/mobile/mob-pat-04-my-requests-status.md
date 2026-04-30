# MOB-PAT-04 — Mobile My Requests & Status Tracking

| Field | Value |
|-------|-------|
| Role  | Patient (mobile) |
| Layer | Mobile (Flutter) |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 6.5 · User Flows: F4 |
| Existing Code | `apps/mobile/lib/features/`, MOB-PAT-01, PAT-BE-05 |

## Scope

List of the patient's submitted requests with status badges, plus a detail screen showing the status progress stepper, history timeline, and team messages. Mirrors PAT-FE-08.

## Objectives

- `MyRequestsScreen` (`/requests`) — pull-to-refresh list with case reference, type, submission date, status badge.
- `RequestDetailScreen` (`/requests/:id`) — status stepper, submitted-fields summary, status history timeline, team messages, "Reply" CTA opening MOB-PAT-06 chat thread.
- Empty state when no requests with CTA to LOA flow (MOB-PAT-03).

## Out of Scope

- Status backend (PAT-BE-05).

## Dependencies

- MOB-PAT-01, PAT-BE-05.

## Acceptance Criteria

- [ ] List displays patient's own cases with badges color-coded by status.
- [ ] Pull-to-refresh refetches.
- [ ] Detail page renders stepper and history.
- [ ] Reply CTA opens chat thread for the case.
- [ ] Tested on iOS and Android.

## Verification

- **Manual demo**: as `patient@hpcms.local` mobile, view seeded cases.
- **Automated check**: `cd apps/mobile && flutter analyze && flutter test`.
