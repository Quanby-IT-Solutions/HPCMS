# HPCMS Demo Tickets

Role-aligned ticket inventory for a fully functional demo of the SLMC Patient Case Management System. Tickets cover all three TOR phases (Phase 1 MVP, Phase 2 omni-channel & SMART on FHIR, Phase 3 AI/incident/claims) and acknowledge already-scaffolded modules in the monorepo.

Source documents:
- [`docs/TOR-pcms-ai-friendly.md`](../TOR-pcms-ai-friendly.md)
- [`docs/user-flows.md`](../user-flows.md)
- [`docs/user-stories.md`](../user-stories.md)

## Role Legend

| Folder slug | Display name | `user_role` enum |
|-------------|--------------|------------------|
| `system-admin/` | System Admin | `system_admin` |
| `tenant-admin/` | Tenant Admin | `tenant_admin` |
| `supervisor/` | Supervisor | `case_supervisor` |
| `case-agent/` | Case Agent | `case_agent` |
| `clinician/` | Clinician | `clinician` |
| `patient/` | Patient | `patient` |

## Ticket Categories

Every ticket falls into one of four categories:

1. **Planning & Architecture** — IA, routing, module structure, contract layout. Produces design notes and skeletons, not feature code.
2. **Frontend Design & UI/UX** — design tokens, component primitives, shared layouts and patterns reusable by Page Implementation tickets.
3. **Page Implementation** — full pages or panels with verifiable acceptance criteria.
4. **Integration & API Connectivity** — oRPC wiring, FHIR connectors, third-party adapters, XML generators.

Frontend and backend tickets are kept strictly separate — no ticket spans both layers.

## Demo Login Credentials

All seeded users use password `DevPass123!`:

| Role | Email |
|------|-------|
| System Admin | `system@hpcms.local` |
| Tenant Admin | `admin@hpcms.local` |
| Supervisor | `supervisor@hpcms.local` |
| Case Agent | `agent@hpcms.local` |
| Clinician | `clinician@hpcms.local` |
| Patient | `patient@hpcms.local` |

Seed tenant: `HPCMS Hospital` (`seed-tenant-hpcms`). Seeded patients: Maria Santos (linked to patient user), Pedro Cruz.

## Ticket Index

### System Admin (14 frontend · 11 backend)
- Frontend: [`system-admin/frontend/`](./system-admin/frontend/)
- Backend: [`system-admin/backend/`](./system-admin/backend/)

### Tenant Admin (14 frontend · 9 backend)
- Frontend: [`tenant-admin/frontend/`](./tenant-admin/frontend/)
- Backend: [`tenant-admin/backend/`](./tenant-admin/backend/)

### Supervisor (20 frontend · 12 backend)
- Frontend: [`supervisor/frontend/`](./supervisor/frontend/)
- Backend: [`supervisor/backend/`](./supervisor/backend/)

### Case Agent (20 frontend · 12 backend)
- Frontend: [`case-agent/frontend/`](./case-agent/frontend/)
- Backend: [`case-agent/backend/`](./case-agent/backend/)

### Clinician (6 frontend · 5 backend)
- Frontend: [`clinician/frontend/`](./clinician/frontend/)
- Backend: [`clinician/backend/`](./clinician/backend/)

### Patient (12 web frontend · 9 backend · 7 mobile)
- Web Frontend: [`patient/frontend/`](./patient/frontend/)
- Backend: [`patient/backend/`](./patient/backend/)
- Mobile (Flutter): [`patient/mobile/`](./patient/mobile/)

**Total: 151 tickets** (141 original + 3 audit-gap fillers + 7 mobile cluster).

## How to Read a Ticket

Every ticket follows [`_template.md`](./_template.md). Key fields:

- **Source Refs** — pointers back to user-stories.md / user-flows.md / TOR.
- **Existing Code** — paths in `apps/`, `packages/`, or "Greenfield". Always reuse first.
- **Acceptance Criteria** — 5–10 independently verifiable checks. Implementation is "done" when every box can be ticked.
- **Verification** — exact demo steps (URL + role login + clicks) plus the automated check that proves correctness.

## Phase Mapping

Tickets are tagged TOR Phase 1, 2, or 3 in their frontmatter:
- **Phase 1** — patient/practitioner/case core, LOA, portal auth, basic FHIR Patient/Practitioner sync, audit/consent foundation.
- **Phase 2** — omni-channel inbox, SMART on FHIR clinician sidebar, more FHIR resources, KB + chatbot MVP, programs/devices.
- **Phase 3** — AI triage/risk, major incidents, claims + PhilHealth XML, DRG, advanced reporting.
