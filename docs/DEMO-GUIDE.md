# HPCMS Executive Demo Guide
### St. Luke's Medical Center — Healthcare Patient Case Management System

> **Duration:** ~25 minutes for full run | ~12 minutes for highlight reel (Acts 1–3 only)
> **App URL:** http://localhost:3001
> **All passwords:** `DevPass123!`

---

## Quick Reference

| Role | Email | Lands On | Story Character |
|---|---|---|---|
| Patient | patient@hpcms.local | /portal/dashboard | Maria Santos |
| Case Agent | agent@hpcms.local | /agent/cases | Carlo Bautista |
| Case Supervisor | supervisor@hpcms.local | /supervisor/patients | Ana Reyes |
| Tenant Admin | admin@hpcms.local | /tenant-admin/audit | SLMC Compliance Officer |
| System Admin | system@hpcms.local | /admin/users | Quanby Platform Admin |

**Pre-seeded data:** 2 patients · 3 LOA cases (HPCMS-1001 submitted, HPCMS-1002 in review, HPCMS-1003 approved) · 1 practitioner (Dr. Juan Dela Cruz)

---

## ACT 1 — The Patient Experience
*Maria Santos needs a Letter of Authority to admit her child at SLMC. She opens the patient portal from her phone.*

---

### Scene 1 — Discovery: The Public Knowledge Base

> Go to: `http://localhost:3001/portal`

**What to show:**
- Landing page with "Patient Portal" branding — accessible without login
- Click **Knowledge Base** in the nav → `/portal/kb`
- Browse or search an article — this is open to the public, no account needed
- Show an article detail page: `/portal/kb/article/[slug]`

> **Pro tip:** "We keep the KB public so patients can self-serve before they even create an account — reducing inbound call volume from day one."

---

### Scene 2 — Registration & Identity Verification

> Go to: `/portal/register`

**What to show:**
- Registration form (skip filling out — accounts are pre-seeded)
- Mention email verification step → `/portal/verify-email`
- After first login, the system shows a **Welcome** screen → `/portal/welcome`
- Patient must verify their identity by MRN + Date of Birth + Last Name before they can submit cases → `/portal/verify`

> **Pro tip:** "Identity binding happens once. After that, every case the patient submits is automatically linked to their medical record."

---

### Scene 3 — Logging In as Maria Santos

> Go to: `/portal/login`
> Login: `patient@hpcms.local` / `DevPass123!`

**What to show:**
- Clean login form — no clutter, mobile-friendly
- Auto-redirects to `/portal/dashboard` on success

---

### Scene 4 — The Patient Dashboard

> Go to: `/portal/dashboard`

**What to show:**
- Summary cards: active requests, notifications, quick links
- Linked patient record visible (Maria Santos / MRN-001)
- **Notifications bell** — click to see `/portal/notifications`
- Show an unread notification detail: `/portal/notifications/[id]`

---

### Scene 5 — Submitting a New LOA Request

> Go to: `/portal/loa/new`

**What to show:**
- Multi-step LOA form: patient info pre-filled from verified identity, insurance details, practitioner selection
- Clicking **New Request** from the My Requests page also reaches this form
- Submit → confirmation screen: `/portal/loa/[caseId]/confirmation`
- Case reference number displayed (e.g., HPCMS-1004)

> **Pro tip:** "The reference number is the patient's tracking ID — it maps directly to the case the agent sees on their side."

---

### Scene 6 — Tracking Requests

> Go to: `/portal/requests`

**What to show:**
- List of Maria's requests — HPCMS-1001 (Submitted), HPCMS-1003 (Approved) visible
- Click HPCMS-1001 → `/portal/requests/HPCMS-1001` — full case detail: status, timeline, attachments
- Click HPCMS-1003 → show approved case with outcome note

---

### Scene 7 — Messaging the Care Team

> Go to: `/portal/chat`

**What to show:**
- Thread list — ongoing conversations with care team
- Click a thread → `/portal/chat/[threadId]` — real-time messaging view
- Mention the **AI Chatbot** as a first-response layer → `/portal/chatbot`

*"Maria can message her care coordinator at any time, or ask the chatbot for quick answers before escalating to a human."*

---

**ACT 1 CLOSE** — *Log out. Maria's request is now sitting in the queue. Let's see what happens on the other side.*

---

## ACT 2 — The Case Agent Workflow
*Carlo Bautista starts his shift. He has a queue of cases to process.*

---

### Scene 8 — The Agent Dashboard & Case Queue

> Login: `agent@hpcms.local` / `DevPass123!`
> Go to: `/agent/cases`

**What to show:**
- Filtered table of cases assigned to Carlo — HPCMS-1002 shows as In Review
- Status badges, priority indicators, SLA countdown visible
- Filter by status, priority, case type
- Click **HPCMS-1002** → `/agent/cases/HPCMS-1002`

---

### Scene 9 — Working a Case

> Go to: `/agent/cases/HPCMS-1002`

**What to show:**
- Case detail: patient info (Pedro Cruz), practitioner (Dr. Dela Cruz), insurance details
- Status timeline — shows when it was submitted, when it entered review
- Activity log — every action tracked
- Agent can update status, add notes, upload attachments
- Link to patient record: click patient name

---

### Scene 10 — Patient Lookup & Timeline

> Go to: `/agent/patients`

**What to show:**
- Patient search by name, MRN, or DOB
- Search "Santos" → find Maria Santos
- Click → `/agent/patients/seed-pat-001`
- Patient profile: demographics, linked cases, recent activity
- Click **Timeline** tab → `/agent/patients/seed-pat-001/timeline` — chronological event stream

> **Pro tip:** "Agents never have to leave the case view to look up a patient — but when they do, the full timeline gives them complete context without switching systems."

---

### Scene 11 — Inbox, Calls & Playbooks

> Go to: `/agent/inbox`

**What to show:**
- Inbox: incoming messages, unread count
- **Log Call** → `/agent/inbox/log-call` — agent documents a phone call with structured fields
- **Log Social** → `/agent/inbox/log-social` — for LINE, Messenger, social channel contacts
- Go to `/agent/playbooks` — step-by-step runbooks for common case scenarios

---

### Scene 12 — Claims Management

> Go to: `/agent/claims`

**What to show:**
- Claims list tied to cases
- Click a claim → `/agent/claims/[id]`
- **Payers** tab → `/agent/claims/payers` — HMO and insurance payer directory
- Export options: **CF5** → `/agent/claims/[id]/export/cf5` | **eSOA** → `/agent/claims/[id]/export/esoa`

> **Pro tip:** "One click generates a print-ready CF5 or eSOA — no manual transcription, no formatting time."

---

**ACT 2 CLOSE** — *Carlo has reviewed the case and escalated to his supervisor for final decision. Let's follow that escalation.*

---

## ACT 3 — The Supervisor View
*Ana Reyes, Case Supervisor, manages the team, handles escalations, and keeps operations running smoothly.*

---

### Scene 13 — Patient Registry & New Registrations

> Login: `supervisor@hpcms.local` / `DevPass123!`
> Go to: `/supervisor/patients`

**What to show:**
- Full patient registry — both Maria Santos and Pedro Cruz visible
- Search, filter by consent status, date registered
- **New Patient** button → `/supervisor/patients/new` — add walk-in or paper intake
- Click Maria Santos → `/supervisor/patients/seed-pat-001`

---

### Scene 14 — Patient Profile: The Full Picture

> Go to: `/supervisor/patients/seed-pat-001`

**What to show:**
- **Overview** tab: demographics, consent flags (DPA consent, EMR sharing), MRN
- **Cases** tab: all linked cases — HPCMS-1001, HPCMS-1003
- **Audit** tab: powered by `PatientAuditHistoryPanel` — who touched this record and when
- **Consent** tab: powered by `ConsentHistoryPanel` — full consent history with capture method and document links
- **Merge** action → `/supervisor/patients/seed-pat-001/merge` — de-duplicate duplicate registrations

> **Pro tip:** "The audit and consent tabs are tenant-admin grade visibility surfaced directly in the patient profile — supervisors don't need to leave to get compliance-level detail."

---

### Scene 15 — Open a New Case for a Patient

> Go to: `/supervisor/patients/seed-pat-001/new-case`

**What to show:**
- Case creation form pre-filled with patient identity
- Select case type (LOA), practitioner, priority
- Supervisor can open cases on behalf of patients who called in or walked in

---

### Scene 16 — Case Management Board

> Go to: `/supervisor/cases`

**What to show:**
- All tenant cases — HPCMS-1001, 1002, 1003 visible
- Filter by status, priority, assigned agent, date range
- Click **HPCMS-1002** → `/supervisor/cases/HPCMS-1002`
- Supervisor can reassign, escalate, override status, add resolution notes

---

### Scene 17 — Incident Management

> Go to: `/supervisor/incidents`

**What to show:**
- Incident list with severity badges (low/medium/high/critical)
- **New Incident** → `/supervisor/incidents/new` — form to log a system or care incident
- Click an incident → `/supervisor/incidents/[id]`

**On the incident detail:**
- Affected scope: departments, cohorts, systems
- Status timeline: detected → investigating → mitigating → resolved
- Root cause notes and resolution documentation fields
- Linked case references — attach related cases to the incident

> **Pro tip:** "Incidents span cases. If 5 patients were affected by the same payer delay, one incident record ties them all together with a root cause and resolution doc."

---

### Scene 18 — Operational Insights

> Go to: `/supervisor/insights`

**What to show:**
- KPI cards: open cases, SLA compliance rate, avg resolution time
- Charts: case volume over time, resolution trends
- Team performance breakdown

---

### Scene 19 — Supporting Features

> Go to: `/supervisor/enrollments`

**What to show:**
- Enrollment list → `/supervisor/enrollments/[id]` — manage patient enrollment in programs

> Go to: `/supervisor/devices`

**What to show:**
- Device registry → `/supervisor/devices/[id]` — linked patient devices (wearables, monitors)

> Go to: `/supervisor/practitioners`

**What to show:**
- Practitioner directory — Dr. Juan Dela Cruz listed with specialty and license number

> Go to: `/supervisor/knowledge-base`

**What to show:**
- KB article management — same articles patients see in the portal, authored here
- Edit an article → `/supervisor/knowledge-base/[id]/edit`
- Preview exactly as the patient sees it → `/supervisor/knowledge-base/[id]/preview`
- Manage categories → `/supervisor/knowledge-base/categories`

---

**ACT 3 CLOSE** — *Operations are healthy. Now the SLMC compliance officer needs to run her monthly review.*

---

## ACT 4 — Tenant Admin: Compliance & Governance
*The SLMC Compliance Officer (Tenant Admin) reviews access logs, PHI usage, and generates the monthly DPA report — all without leaving the system.*

---

### Scene 20 — Audit Log Viewer

> Login: `admin@hpcms.local` / `DevPass123!`
> Go to: `/tenant-admin/audit`

**What to show:**
- Full audit trail: who performed what action, on which record, at what time
- Filter by actor, action type, record type, date range
- Drill into an event → drawer with before/after field diff
- **Export CSV** button — one click download of filtered audit data

---

### Scene 21 — Login Event Monitoring

> Go to: `/tenant-admin/audit/logins`

**What to show:**
- KPI strip: total logins, success rate, failed attempts, blocked, suspicious count
- Login event table: user, role, outcome badge, IP address, timestamp
- Outcome filter: show only `failed_credentials` or `suspicious` events
- Click a user row → links to full audit trail filtered for that user

> **Pro tip:** "If you see 15 failed logins from the same IP in an hour, it appears right here — not in a separate SIEM tool."

---

### Scene 22 — PHI Access Report

> Go to: `/tenant-admin/compliance/phi-access`

**What to show:**
- Date range parameter form — required before loading data
- Table: who accessed which patient's PHI, what resource type, when, from which IP
- **Anomaly flag** column — rows with detected anomalies highlighted in red
- Filter to anomaly-only rows
- CSV export for regulatory submission

---

### Scene 23 — DPA Compliance Dashboard

> Go to: `/tenant-admin/compliance`

**What to show:**
- KPI cards: consent coverage %, retention compliance rate, open data subject requests, overdue requests
- Compliance items table: category, status badge (compliant / partial / non-compliant), score, last checked date
- Real-time picture of where SLMC stands against DPA obligations

---

### Scene 24 — Printable DPA Report

> Go to: `/tenant-admin/compliance/dpa`

**What to show:**
- Period selector (e.g., 2026-Q1)
- Report renders: header, KPI table, compliance items, findings with severity and recommended actions
- **Print to PDF** button — triggers browser print with clean print stylesheet (no sidebar, no nav)

> **Pro tip:** "This is your regulator-ready report. No copy-paste, no manual formatting — select the quarter, click Print."

---

### Scene 25 — JCI Handoff Audit

> Go to: `/tenant-admin/compliance/handoffs`

**What to show:**
- Compliance rate KPI card at the top
- Handoff event table: from agent, to agent, handoff type, verbal confirmed checkbox, compliance gap notes
- Filter to non-compliant handoffs — these are the ones that need follow-up
- Row expansion for full timeline view

---

### Scene 26 — Boundary Violation Detection

> Go to: `/tenant-admin/security/boundary-violations`

**What to show:**
- KPI strip: open critical, open warning, resolved this week, total unresolved
- Violations table with severity badges
- Row action **Mark Resolved** → slide-out drawer, enter resolution note, confirm
- CSV export for security team handoff

---

### Scene 27 — Incident Operations (Tenant View)

> Go to: `/tenant-admin/incidents`

**What to show:**
- KPI strip: open incidents, critical count, avg resolution hours, resolved this month
- Severity distribution bar chart — visual breakdown of incident severity
- Table: incident title, department, status, case count
- Click a row title → links to `/supervisor/incidents/[id]` in read-only mode (no edit controls)

> **Pro tip:** "Tenant Admin sees the operational picture without being able to alter incident records — investigation integrity is preserved."

---

### Scene 28 — Facility Configuration

> Go to: `/tenant-admin/facility`

**What to show:**
- **SLA Settings** tab: per-priority response, resolution, and escalation hour thresholds; business hours toggle
- **Notification Templates** tab: edit email/SMS templates, preview with sample patient data
- **Departments** tab: add, edit, deactivate departments; assign department heads
- **Routing Defaults** tab: default team and priority per case type

---

### Scene 29 — Shared Service Policy

> Go to: `/tenant-admin/shared-services`

**What to show:**
- List of inter-facility service agreements: name, service type, covered facilities, SLA hours, effective/expiry dates
- **Add Policy** button → dialog form
- Edit and Delete row actions with confirmation
- Status filter: active / expiring / expired

---

### Scene 30 — Cross-Facility Report Builder

> Go to: `/tenant-admin/reports/cross-facility`

**What to show:**
- Select a metric card: Case Volume / Resolution Time / SLA Compliance / Incident Rate
- Check multiple facilities (mock: Metro General, Eastside Medical, Northview Clinic)
- Set date range and group-by (facility / month / week)
- Click **Generate Report** — results table appears
- Toggle **Combined view** to aggregate all facilities into one row
- PDF export via print

---

**ACT 4 CLOSE** — *Compliance is documented, configuration is set. One level up — the platform operator who provisions SLMC.*

---

## ACT 5 — System Admin: Platform Operations
*The Quanby platform administrator provisions tenants, manages roles, and configures platform-wide settings.*

---

### Scene 31 — User Management

> Login: `system@hpcms.local` / `DevPass123!`
> Go to: `/admin/users`

**What to show:**
- Full user list across all tenants (platform scope)
- Filter by role, tenant, email verified status
- Click a user → `/admin/users/[id]` — edit role, reset credentials, deactivate

---

### Scene 32 — Tenant Provisioning

> Go to: `/admin/tenants`

**What to show:**
- Tenant list: HPCMS Hospital (seed-tenant-hpcms), isActive: true
- **New Tenant** → `/admin/tenants/new` — onboard a new hospital or clinic
- Click HPCMS Hospital → `/admin/tenants/seed-tenant-hpcms` — edit name, status, feature flags

---

### Scene 33 — Role & Permission Management

> Go to: `/admin/roles`

**What to show:**
- Role definitions: system_admin, tenant_admin, case_supervisor, case_agent, clinician, patient
- Permission matrix per role
- Explain the separation: system_admin operates the platform; tenant_admin governs one hospital

---

### Scene 34 — Security & Data Segregation

> Go to: `/admin/security`

**What to show:**
- Platform-level security policies: session timeout, MFA enforcement, IP allowlisting
- Click **Data Segregation** → `/admin/security/data-segregation`
- Show how tenant data isolation is enforced at the platform layer

---

### Scene 35 — Case Types & Routing Rules

> Go to: `/admin/case-types`

**What to show:**
- Registered case types: LOA, plus any others configured
- Each type has a code, label, and schema

> Go to: `/admin/routing-rules`

**What to show:**
- Automated routing configuration: route by case type, patient priority, payer, department
- Rules engine that auto-assigns new cases to the right team

---

### Scene 36 — AI Triage Configuration

> Go to: `/admin/ai-triage`

**What to show:**
- AI triage settings: model, confidence threshold, triage categories
- When a new case arrives, AI pre-classifies priority and suggests routing before a human touches it

> **Pro tip:** "This is the feature that removes the first 5 minutes of every agent's case review — AI triage does the first-pass classification automatically."

---

### Scene 37 — FHIR Integration Settings

> Go to: `/admin/fhir-settings`

**What to show:**
- FHIR server URL, authentication method (client credentials / smart-on-fhir)
- Resource sync configuration: which FHIR resources sync into HPCMS
- Clinician Smart-on-FHIR launch settings (enables the FHIR sidebar for clinicians)

---

### Scene 38 — The Clinician FHIR Sidebar
*(Bonus: show if audience includes clinical informaticists)*

> Mention: The clinician workspace at `/clinician` is launched via Smart-on-FHIR from the hospital's EMR

**What to show:**
- `/clinician/sidebar/[patientId]` — a lightweight FHIR-powered sidebar showing patient summary, active cases, and timeline
- Embedded directly in the EMR's iframe — no separate login, session passed via FHIR launch token
- Error states handled gracefully: `/clinician/launch/error`, `/clinician/callback/error`

---

**ACT 5 CLOSE** — *The platform is provisioned, tenants are isolated, and every action is auditable.*

---

## Closing Narrative

*"What you've seen is a single platform connecting five roles across the entire case management lifecycle:*

*A patient submits a request from her phone — it appears instantly in an agent's queue. The supervisor oversees escalations without being in every conversation. The compliance officer generates a regulator-ready DPA report in two clicks. The platform admin provisions a new hospital in minutes, not days.*

*Every action is logged. Every access is auditable. Every handoff is traceable.*

*This is HPCMS — built for St. Luke's, ready to scale to any healthcare organization in the Philippines."*

---

## Demo Reset Checklist

Before each demo run:
- [ ] Clear browser sessions (or use different browser profiles per role)
- [ ] Run `pnpm db:push && pnpm db:seed` if data was mutated during a prior demo
- [ ] Confirm backend is running: `pnpm dev:backend`
- [ ] Confirm frontend is running: `pnpm dev:web` → http://localhost:3001
- [ ] Open 5 browser tabs pre-logged-in as each role (saves login time mid-demo)

---

## Highlight Reel (12 min version)

For tight time slots, run only:

| Time | Scene | Route | Role |
|---|---|---|---|
| 0:00 | Patient submits LOA | `/portal/loa/new` → confirmation | Maria Santos |
| 2:00 | Patient tracks request | `/portal/requests/HPCMS-1001` | Maria Santos |
| 3:30 | Agent works the case | `/agent/cases/HPCMS-1002` | Carlo Bautista |
| 5:00 | Supervisor case board | `/supervisor/cases` | Ana Reyes |
| 6:30 | Patient profile audit tab | `/supervisor/patients/seed-pat-001` | Ana Reyes |
| 8:00 | DPA compliance dashboard | `/tenant-admin/compliance` | Tenant Admin |
| 9:30 | PHI access report anomalies | `/tenant-admin/compliance/phi-access` | Tenant Admin |
| 11:00 | AI triage + FHIR settings | `/admin/ai-triage` + `/admin/fhir-settings` | System Admin |
