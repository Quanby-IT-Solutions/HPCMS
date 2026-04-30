# MOB-PAT-03 — Mobile Dashboard & LOA Request Submission (with Native File Picker)

| Field | Value |
|-------|-------|
| Role  | Patient (mobile) |
| Layer | Mobile (Flutter) |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 6.2, 6.3, 6.4, 6.10 · User Flows: F2, F3 · TOR: FR-04A, SC-02 |
| Existing Code | `apps/mobile/lib/features/home/`, MOB-PAT-01, PAT-BE-04 |

## Scope

Patient dashboard (post-login landing) and the multi-step LOA Request submission with native camera / file picker for the three required attachments (Admitting Order, Valid ID, HMO ID). Mirrors PAT-FE-06 + PAT-FE-07.

## Objectives

- `DashboardScreen` (`/dashboard`) with: pending request status cards, notification bell, "Submit LOA Request" prominent CTA, KB search entry, chatbot launcher.
- `LoaRequestFlow` multi-step wizard:
 1. Personal & visit details (HMO Card #, Date of Consultation/Procedure, Preferred Doctor, Chief Complaint).
 2. Document upload — three slots using `image_picker` and `file_picker` (PDF or image; show thumbnail preview; allow re-take/replace).
 3. Review summary.
 4. Submit → `LoaConfirmationScreen` with case reference.
- Uploads stream to `portal.loa.submit` with progress indicator.
- Offline guard: if connection lost mid-upload, retain draft locally and resume.

## Out of Scope

- Submission API (PAT-BE-04).

## Dependencies

- MOB-PAT-01, MOB-PAT-02, PAT-BE-04.

## Acceptance Criteria

- [ ] Dashboard renders status cards reflecting `portal.myRequests.list`.
- [ ] LOA wizard captures all 7 SLMC fields.
- [ ] Camera capture and PDF picker both work for each upload slot.
- [ ] Upload progress visible per file.
- [ ] Submission persists and confirmation page shows case reference.
- [ ] Draft is retained when network drops and resumes on reconnect.
- [ ] Tested on iOS and Android.

## Verification

- **Manual demo**: log in as `patient@hpcms.local`, submit a complete LOA with photos taken on the simulator camera.
- **Automated check**: `cd apps/mobile && flutter analyze && flutter test integration_test/loa_flow_test.dart`.
