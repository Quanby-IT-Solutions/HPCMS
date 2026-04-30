# User Stories

## Patient Case Management System (PCMS) for St. Luke's Medical Center (SLMC)

> Derived from the PCMS Terms of Reference. Roles map to the 6 system roles defined in the HPCMS codebase (`user_role` enum):
> **System Admin** (`system_admin`) · **Tenant Admin** (`tenant_admin`) · **Supervisor** (`case_supervisor`) · **Case Agent** (`case_agent`) · **Clinician** (`clinician`) · **Patient** (`patient`)
>
> TOR role mapping: System Administrator → System Admin · Facility Administrator / Compliance Officer / Auditor → Tenant Admin · Care Coordinator / Incident Manager → Supervisor · Back-Office Agent / Claims Officer / HIM Coder → Case Agent · Physician / Nurse → Clinician

---

## 1. User Management & Security

- **Story 1.1 – Secure Login with Multi-Factor Authentication**
  - **As a** System Admin
  - **I want to** enforce multi-factor authentication (2FA) for all user accounts
  - **So that** unauthorized access to the PCMS and protected health information (PHI) is prevented even when credentials are compromised
  - **Pages**: Login Page, MFA Verification Page, Account Settings Page

- **Story 1.2 – Role-Based Access Control Assignment**
  - **As a** System Admin
  - **I want to** assign and manage role-based access permissions for each user account
  - **So that** every staff member only sees and acts on data relevant to their assigned role, enforcing least-privilege access
  - **Pages**: User Management Page, Role Assignment Page, Permission Matrix Page

- **Story 1.3 – Password Policy Enforcement**
  - **As a** System Admin
  - **I want to** configure and enforce password complexity, expiration, and reuse policies system-wide
  - **So that** all user passwords meet hospital security standards and comply with the Philippines Data Privacy Act
  - **Pages**: Password Policy Settings Page, Account Settings Page, Password Reset Page

- **Story 1.4 – Self-Service Password Reset**
  - **As a** Supervisor
  - **I want to** reset my own password through a secure self-service flow
  - **So that** I can regain access to the system quickly without requiring IT intervention
  - **Pages**: Login Page, Password Reset Page, Identity Verification Page

- **Story 1.5 – Session Timeout and Forced Logout**
  - **As a** System Admin
  - **I want to** configure session timeout thresholds and force-expire idle sessions
  - **So that** unattended workstations do not remain authenticated and expose PHI
  - **Pages**: Security Settings Page, Session Management Page, Login Page

- **Story 1.6 – Tenant-Aware Authorization**
  - **As a** System Admin
  - **I want to** restrict user access to records associated with their assigned facility tenant (Quezon City or BGC)
  - **So that** data belonging to one campus is not accessible to staff of another campus unless explicitly authorized
  - **Pages**: User Management Page, Tenant Configuration Page, Access Control Page

- **Story 1.7 – Audit Trail of Login Events**
  - **As a** Tenant Admin
  - **I want to** view a complete audit trail of all login attempts, successful sessions, and logouts with timestamps and IP addresses
  - **So that** suspicious access patterns can be identified and investigated in compliance with audit requirements
  - **Pages**: Audit Log Viewer Page, Login Event Report Page, Security Dashboard

- **Story 1.8 – User Account Provisioning and Deprovisioning**
  - **As a** System Admin
  - **I want to** create, activate, deactivate, and delete user accounts with documented change history
  - **So that** only current authorized staff can access the system and terminated staff are immediately locked out
  - **Pages**: User Management Page, Account Provisioning Form, User Profile Page

- **Story 1.9 – Concurrent Session Control**
  - **As a** System Admin
  - **I want to** limit users to a single active session or a defined maximum number of concurrent sessions
  - **So that** shared credential abuse is detected and account sharing is discouraged
  - **Pages**: Security Settings Page, Active Session Management Page

---

## 2. Patient Master & Patient 360

- **Story 2.1 – Patient Registration**
  - **As a** Supervisor
  - **I want to** register a new patient in the PCMS with full demographic information including name, date of birth, sex, ethnicity, contact details, and consent flags
  - **So that** the patient has a persistent master record that all cases, communications, and clinical data can be linked to
  - **Pages**: Patient Registration Form, Patient Profile Page

- **Story 2.2 – Patient Search and Lookup**
  - **As a** Case Agent
  - **I want to** search for a patient using multiple identifiers such as name, date of birth, medical record number, or contact number
  - **So that** I can quickly locate the correct patient record before creating or updating a case
  - **Pages**: Patient Search Page, Patient Search Results Page, Patient Profile Page

- **Story 2.3 – Demographic Management**
  - **As a** Supervisor
  - **I want to** update a patient's demographic information including address, contact details, and ethnicity
  - **So that** the patient master record remains accurate and communications are directed to the correct channel and location
  - **Pages**: Patient Profile Page, Edit Demographics Form

- **Story 2.4 – Medical Record Number Linking**
  - **As a** Supervisor
  - **I want to** link a patient's PCMS record to their Altera Sunrise medical record number (MRN)
  - **So that** the PCMS and EMR refer to the same patient without duplication or misidentification
  - **Pages**: Patient Profile Page, MRN Linking Form, FHIR Patient Sync Page

- **Story 2.5 – Consent Flag Management**
  - **As a** Supervisor
  - **I want to** record and update each patient's consent status for data processing, communications, and specific service types
  - **So that** all outreach, data sharing, and case actions are performed only within the scope of documented patient consent
  - **Pages**: Patient Profile Page, Consent Management Panel, Consent History Log

- **Story 2.6 – Patient 360 Communication Timeline**
  - **As a** Case Agent
  - **I want to** view a unified chronological timeline of all interactions with a patient across every communication channel and case
  - **So that** I have full context of the patient's service history before engaging with them or updating a case
  - **Pages**: Patient 360 Timeline Page, Patient Profile Page

- **Story 2.7 – Cross-Channel Interaction History**
  - **As a** Supervisor
  - **I want to** see all prior email, phone, portal chat, and social media interactions consolidated in one patient view
  - **So that** I do not ask patients to repeat information already shared through a different channel
  - **Pages**: Patient 360 Timeline Page, Communication History Panel

- **Story 2.8 – Duplicate Patient Detection**
  - **As a** Supervisor
  - **I want to** be warned when a patient record I am creating appears to match an existing record based on name, birthdate, and contact information
  - **So that** duplicate records that would fragment the patient's communication history are avoided
  - **Pages**: Patient Registration Form, Duplicate Detection Alert Modal

- **Story 2.9 – Patient Record Audit History**
  - **As a** Tenant Admin
  - **I want to** view the full change history of a patient master record including who made each change and when
  - **So that** unauthorized or erroneous modifications to patient data are identifiable and traceable
  - **Pages**: Patient Profile Page, Patient Audit History Panel

---

## 3. Healthcare Case Management

- **Story 3.1 – Case Creation**
  - **As a** Supervisor
  - **I want to** create a new healthcare case linked to a patient, a case type, a source channel, and an assigned team
  - **So that** the patient's service request is formally tracked and routed to the appropriate team for resolution
  - **Pages**: New Case Form, Case Detail Page, Patient Profile Page

- **Story 3.2 – Case Queue Dashboard**
  - **As a** Case Agent
  - **I want to** view a real-time dashboard of all open cases assigned to my team, filtered by priority, type, and status
  - **So that** I can efficiently triage my workload and address the most urgent cases first
  - **Pages**: Case Queue Dashboard, Case Filter Panel

- **Story 3.3 – Case Assignment and Routing**
  - **As a** Supervisor
  - **I want to** assign a case to a specific agent or team and route it based on case type, department, or workflow rules
  - **So that** the right staff handle each case without manual escalation chains causing delays
  - **Pages**: Case Detail Page, Case Assignment Panel, Routing Rules Configuration Page

- **Story 3.4 – Case Prioritization**
  - **As a** Supervisor
  - **I want to** set and update the priority level of a case (e.g., low, normal, high, urgent)
  - **So that** critical patient service issues receive attention ahead of lower-urgency requests
  - **Pages**: Case Detail Page, Case Queue Dashboard, Priority Update Modal

- **Story 3.5 – Case Escalation**
  - **As a** Case Agent
  - **I want to** escalate a case to a senior coordinator or a different team when it exceeds my authority or SLA thresholds
  - **So that** unresolved or complex cases are handled by the appropriate escalation level without falling through the cracks
  - **Pages**: Case Detail Page, Escalation Form, Case Escalation History Panel

- **Story 3.6 – Case Resolution and Closure**
  - **As a** Case Agent
  - **I want to** mark a case as resolved with resolution notes and a closure timestamp
  - **So that** completed work is recorded, SLA tracking is accurate, and the patient's timeline reflects the outcome
  - **Pages**: Case Detail Page, Resolution Notes Form, Case Status History Panel

- **Story 3.7 – Extendable Case Types**
  - **As a** System Admin
  - **I want to** configure and add new case types (e.g., LOA Request, Drug Program Enrollment, Billing Inquiry, Complaint, Care Coordination) without requiring code changes
  - **So that** the system can support evolving hospital workflows without engaging developers for each new service category
  - **Pages**: Case Type Configuration Page, Case Type List Page, New Case Form

- **Story 3.8 – Case Linking to Patient, Practitioner, and Service**
  - **As a** Supervisor
  - **I want to** link a case to a specific patient record, an attending practitioner, and a service request type
  - **So that** all parties involved in a care event are clearly associated and context is preserved throughout the case lifecycle
  - **Pages**: Case Detail Page, Case Linking Panel, Patient Search Page, Practitioner Lookup Page

- **Story 3.9 – Case Status Tracking**
  - **As a** Supervisor
  - **I want to** track the real-time status of each case through defined workflow stages (e.g., Open, In Progress, Pending Patient, Escalated, Resolved, Closed)
  - **So that** any stakeholder can determine the current state of a patient service request at a glance
  - **Pages**: Case Detail Page, Case Queue Dashboard, Case Status History Panel

- **Story 3.10 – Case Linking Between Related Cases**
  - **As a** Supervisor
  - **I want to** link related cases together (e.g., a billing inquiry that spawned from a previous LOA request)
  - **So that** agents have full context of a patient's interconnected service history and avoid duplicating effort
  - **Pages**: Case Detail Page, Related Cases Panel, Case Search Page

---

## 4. Omni-Channel Communication Inbox

- **Story 4.1 – Unified Inbox View**
  - **As a** Case Agent
  - **I want to** view all incoming patient communications (email, phone log entries, portal chat messages, and social media inquiries) in a single unified inbox
  - **So that** no patient interaction is missed regardless of the channel through which it arrived
  - **Pages**: Unified Inbox Page, Communication Filter Panel

- **Story 4.2 – Email Channel Management**
  - **As a** Case Agent
  - **I want to** receive, read, reply to, and archive patient email communications directly within the PCMS
  - **So that** I do not need to switch to a separate email client and the response is automatically logged to the patient's record
  - **Pages**: Unified Inbox Page, Email Thread View, Email Reply Composer

- **Story 4.3 – Phone Call Log Entry**
  - **As a** Case Agent
  - **I want to** log an inbound or outbound phone call with the patient including date, time, duration, agent, and call summary
  - **So that** all telephone interactions are documented in the patient timeline just as digital channels are
  - **Pages**: Unified Inbox Page, Call Log Entry Form, Patient 360 Timeline Page

- **Story 4.4 – Social Media Inquiry Capture**
  - **As a** Case Agent
  - **I want to** capture patient inquiries received via social media platforms into the PCMS inbox as case-linked interaction records
  - **So that** social media contacts receive the same documented follow-up and are visible in the patient communication timeline
  - **Pages**: Unified Inbox Page, Social Media Inquiry Form, Case Detail Page

- **Story 4.5 – Secure Portal Chat**
  - **As a** Patient
  - **I want to** send and receive messages through a secure chat interface within the patient portal
  - **So that** I can communicate with the hospital care team through an authenticated channel without using unencrypted messaging
  - **Pages**: Patient Portal Chat Page, Back-Office Inbox Chat Thread

- **Story 4.6 – Conversation Continuity Across Channels**
  - **As a** Case Agent
  - **I want to** see a patient's full prior interactions across all channels before responding to a new incoming message
  - **So that** I can acknowledge what the patient has already communicated through other channels and avoid asking them to repeat themselves
  - **Pages**: Patient 360 Timeline Page, Unified Inbox Page, Interaction Detail Page

- **Story 4.7 – Attaching Communications to Case and Patient**
  - **As a** Case Agent
  - **I want to** attach a communication record (email, call log, chat transcript) to a specific open case and to the patient master record
  - **So that** the full interaction history is accessible from both the case and the patient profile
  - **Pages**: Unified Inbox Page, Case Detail Page, Patient 360 Timeline Page, Attach to Case Modal

- **Story 4.8 – Search and Filter Interactions**
  - **As a** Supervisor
  - **I want to** search and filter communications by date range, channel type, issue type, assigned agent, and status
  - **So that** I can locate specific interactions quickly during an audit, dispute, or patient follow-up
  - **Pages**: Unified Inbox Page, Communication Search Page, Advanced Filter Panel

- **Story 4.9 – Outbound Communication Dispatch**
  - **As a** Case Agent
  - **I want to** send an outbound email or portal message to a patient directly from their case record
  - **So that** all outbound communications are tied to the originating case and visible in the patient's 360 timeline
  - **Pages**: Case Detail Page, Outbound Message Composer, Patient 360 Timeline Page

---

## 5. AI-Assisted Triage & Proactive Service

- **Story 5.1 – Automatic Request Categorization**
  - **As a** Case Agent
  - **I want to** have incoming patient requests automatically categorized by type (e.g., LOA, billing, complaint, care coordination) based on their content
  - **So that** requests are routed to the correct team queue immediately without manual triage delay
  - **Pages**: Unified Inbox Page, Case Queue Dashboard, Auto-Categorization Settings Page

- **Story 5.2 – Trend and Pattern Detection**
  - **As a** Supervisor
  - **I want to** see alerts when the system detects a spike in similar case types or recurring complaints from a patient cohort
  - **So that** systemic service issues are identified early and addressed before they escalate into major incidents
  - **Pages**: AI Insights Dashboard, Trend Alert Panel, Case Analytics Page

- **Story 5.3 – Guided Playbook Recommendations**
  - **As a** Case Agent
  - **I want to** receive a recommended step-by-step playbook when I open a case of a particular type
  - **So that** I follow the correct handling procedure consistently and reduce resolution time for common case patterns
  - **Pages**: Case Detail Page, Playbook Recommendation Panel, Playbook Library Page

- **Story 5.4 – Escalation Risk Surfacing**
  - **As a** Supervisor
  - **I want to** see a risk indicator on cases that are predicted to escalate based on age, channel, and complaint pattern
  - **So that** I can proactively intervene before a case breaches its SLA or triggers a formal complaint
  - **Pages**: Case Queue Dashboard, Case Detail Page, Escalation Risk Indicator

- **Story 5.5 – Rule-Based Routing Configuration**
  - **As a** System Admin
  - **I want to** define and manage routing rules that automatically assign cases to specific teams or agents based on case type, priority, source channel, or patient attributes
  - **So that** routing logic is consistent, auditable, and adjustable without code changes
  - **Pages**: Routing Rules Configuration Page, Rule Builder Interface, Case Routing Log

- **Story 5.6 – Agent Workload Balancing Suggestion**
  - **As a** Supervisor
  - **I want to** receive a suggestion for which available agent to assign a new case to based on current open case load
  - **So that** work is distributed equitably and no single agent becomes a bottleneck
  - **Pages**: Case Assignment Panel, Team Workload View, Case Queue Dashboard

- **Story 5.7 – AI Triage Configuration**
  - **As a** System Admin
  - **I want to** configure the categories, keywords, and rules used by the auto-categorization engine
  - **So that** the triage logic reflects SLMC's actual service taxonomy and improves over time as new case types emerge
  - **Pages**: AI Triage Configuration Page, Category Rule Manager, Triage Test Simulator

- **Story 5.8 – Knowledge Base Article Management**
  - **As a** Supervisor
  - **I want to** create, edit, categorize, and publish articles in the hospital knowledge base
  - **So that** patients searching the portal and the chatbot can access accurate, up-to-date information about hospital procedures, HMO requirements, and care programs without contacting staff
  - **Pages**: Knowledge Base Management Page, Article Editor, Article Categories Page, Article Preview Page

---

## 6. Patient Self-Service Portal

- **Story 6.1 – Patient Portal Registration**
  - **As a** Patient
  - **I want to** register for the patient self-service portal using my email address, a verified phone number, and a secure password
  - **So that** I have a personal authenticated account through which I can submit requests and track their status
  - **Pages**: Patient Portal Registration Page, Email Verification Page, Portal Welcome Page

- **Story 6.2 – Patient Portal Login**
  - **As a** Patient
  - **I want to** log in to the patient portal with my credentials and optionally with a second authentication factor
  - **So that** my personal health-related requests and communications are protected from unauthorized access
  - **Pages**: Patient Portal Login Page, MFA Verification Page, Patient Portal Dashboard

- **Story 6.3 – LOA Request Submission**
  - **As a** Patient
  - **I want to** submit a Letter of Authorization (LOA) request through the portal by completing all required fields: Admitting Order file upload, HMO Card Number, Date of Consultation/Procedure, Preferred Doctor Name, Chief Complaint, Valid ID upload, and HMO ID upload
  - **So that** my HMO authorization request reaches the hospital's care coordination team with all necessary documentation attached
  - **Pages**: LOA Request Form, File Upload Component, LOA Submission Confirmation Page

- **Story 6.4 – LOA Field Validation and Required-Field Enforcement**
  - **As a** Patient
  - **I want to** receive clear inline validation messages if I leave a required field empty or upload an unsupported file type on the LOA form
  - **So that** I can correct my submission before sending it and avoid delays caused by incomplete applications
  - **Pages**: LOA Request Form, Validation Error Display Component

- **Story 6.5 – Submission Status Tracking**
  - **As a** Patient
  - **I want to** view the current status of all my submitted requests (e.g., Received, Under Review, Approved, Rejected) from my portal dashboard
  - **So that** I do not need to call the hospital to know where my LOA or other request stands
  - **Pages**: Patient Portal Dashboard, My Requests Page, Request Detail Status Page

- **Story 6.6 – Knowledge Base Search**
  - **As a** Patient
  - **I want to** search a curated medical knowledge base for answers to common questions about hospital procedures, HMO requirements, and care programs
  - **So that** I can find information on my own without waiting for a staff response for straightforward inquiries
  - **Pages**: Knowledge Base Search Page, Article Detail Page, Patient Portal Dashboard

- **Story 6.7 – Chatbot Interaction for Triage**
  - **As a** Patient
  - **I want to** interact with a chatbot that can help me identify which service I need, what documents to prepare, and which form to submit
  - **So that** I am guided to the right self-service action without needing to navigate the portal manually or call the hospital
  - **Pages**: Patient Portal Chatbot Interface, Patient Portal Dashboard, LOA Request Form

- **Story 6.8 – Chatbot FAQ Handling**
  - **As a** Patient
  - **I want to** ask the chatbot common questions about hospital policies, operating hours, and department contacts and receive accurate automated answers
  - **So that** routine queries are resolved immediately without consuming staff time
  - **Pages**: Patient Portal Chatbot Interface, FAQ Knowledge Base

- **Story 6.9 – Chatbot Appointment Scheduling Assistance**
  - **As a** Patient
  - **I want to** use the chatbot to inquire about scheduling a consultation or follow-up appointment
  - **So that** I can initiate scheduling through a conversational interface and be directed to the correct booking workflow
  - **Pages**: Patient Portal Chatbot Interface, Appointment Inquiry Flow

- **Story 6.10 – Secure Document Upload Handling**
  - **As a** Patient
  - **I want to** upload documents (Admitting Order, Valid ID, HMO ID) through the portal with confirmation that they have been securely received
  - **So that** I am confident that sensitive identity documents are transmitted safely and linked to my request
  - **Pages**: LOA Request Form, File Upload Component, Upload Confirmation Notice

- **Story 6.11 – Patient Portal Password Reset**
  - **As a** Patient
  - **I want to** reset my patient portal password through a secure self-service flow using my registered email address
  - **So that** I can regain access to my portal account and pending requests without contacting the hospital
  - **Pages**: Patient Portal Login Page, Patient Portal Password Reset Page, Identity Verification Page, New Password Form

- **Story 6.12 – Patient Notification Inbox**
  - **As a** Patient
  - **I want to** view a notification inbox in the patient portal showing updates about my submitted requests, approved LOAs, and messages from the care team
  - **So that** I am promptly informed of important changes to my requests without having to manually check the status page
  - **Pages**: Patient Portal Dashboard, Patient Notification Inbox Page, Notification Detail Page

---

## 7. Major Incident Management

- **Story 7.1 – Incident Creation from Aggregated Cases**
  - **As a** Supervisor
  - **I want to** create a major incident record by aggregating two or more related cases that share a common root cause or affected population
  - **So that** systemic issues like disease outbreaks or IT outages are managed as unified incidents rather than scattered individual cases
  - **Pages**: Incident Creation Form, Case Aggregation Selector, Incident Detail Page

- **Story 7.2 – Affected Scope Tracking**
  - **As a** Supervisor
  - **I want to** record and update the list of affected departments, patient cohorts, and systems within an incident record
  - **So that** the full operational impact of a major event is documented and visible to leadership
  - **Pages**: Incident Detail Page, Affected Scope Panel, Department/Patient Selector

- **Story 7.3 – Incident Severity Classification**
  - **As a** Supervisor
  - **I want to** assign and update the severity level of a major incident (e.g., Low, Moderate, High, Critical)
  - **So that** response resources and escalation protocols are activated proportional to the actual impact
  - **Pages**: Incident Detail Page, Severity Classification Panel

- **Story 7.4 – Incident Status Management**
  - **As a** Supervisor
  - **I want to** track and update the status of a major incident through its lifecycle stages (e.g., Detected, Investigating, Containing, Resolved, Post-Incident Review)
  - **So that** all responders share a common understanding of where the incident stands
  - **Pages**: Incident Detail Page, Incident Status Timeline

- **Story 7.5 – Root Cause Documentation**
  - **As a** Supervisor
  - **I want to** document root cause findings, contributing factors, and interim mitigations within the incident record
  - **So that** the post-incident review has a factual basis and the same issue can be prevented in future operations
  - **Pages**: Incident Detail Page, Root Cause Notes Panel

- **Story 7.6 – Incident Resolution Tracking**
  - **As a** Supervisor
  - **I want to** record resolution actions, closure criteria, and a formal resolved timestamp when an incident is closed
  - **So that** the full incident lifecycle is auditable and closed incidents are distinguishable from active ones
  - **Pages**: Incident Detail Page, Resolution Documentation Form, Incident Audit History

- **Story 7.7 – Rapid Operations Visibility Dashboard**
  - **As a** Tenant Admin
  - **I want to** view a dashboard summarizing all active major incidents with their severity, affected scope, and current status
  - **So that** executive and operations leadership can monitor hospital-wide service disruptions in real time
  - **Pages**: Incident Operations Dashboard, Incident List Page, Incident Detail Page

- **Story 7.8 – Linking Cases to an Incident**
  - **As a** Supervisor
  - **I want to** associate additional related cases to an existing major incident as new reports come in
  - **So that** the growing scope of the incident is continuously reflected and no impacted case is managed in isolation
  - **Pages**: Incident Detail Page, Case-to-Incident Linking Panel, Case Search Page

---

## 8. Program Enrollment & Medical Device Tracking

- **Story 8.1 – Patient Program Enrollment**
  - **As a** Supervisor
  - **I want to** enroll a patient in a specialized care program (e.g., Diabetes Management, Oncology Support) with a recorded enrollment date, coordinator, and status
  - **So that** the patient's participation in structured care pathways is tracked and visible across their case and profile records
  - **Pages**: Program Enrollment Form, Patient Profile Page, Enrolled Programs Panel

- **Story 8.2 – Enrollment Lifecycle Management**
  - **As a** Supervisor
  - **I want to** update a patient's program enrollment status through its lifecycle stages (e.g., Active, Suspended, Completed, Withdrawn) and record the effective and end dates
  - **So that** the program registry accurately reflects current participation and supports continuity of care handoffs
  - **Pages**: Enrollment Detail Page, Enrollment Status Update Form, Program Enrollment History

- **Story 8.3 – Program Enrollment Listing and Search**
  - **As a** Supervisor
  - **I want to** search and filter patient program enrollments by program name, status, enrollment date, and assigned coordinator
  - **So that** I can quickly identify all patients in a specific program and their current participation status
  - **Pages**: Program Enrollment List Page, Enrollment Search and Filter Panel

- **Story 8.4 – Medical Device Assignment to Patient**
  - **As a** Supervisor
  - **I want to** assign a specific medical device (e.g., CPAP machine, IoT monitor) to a patient and link it to their case record, recording the serial number, device type, and assignment date
  - **So that** physical equipment issued to patients is formally tracked and can be located, maintained, or retrieved as needed
  - **Pages**: Device Assignment Form, Patient Profile Page, Case Detail Page

- **Story 8.5 – Device Lifecycle Tracking**
  - **As a** Supervisor
  - **I want to** update the status of an assigned device through its lifecycle (e.g., Assigned, In Use, Returned, Decommissioned, Under Maintenance)
  - **So that** the operational state of all patient-assigned devices is current and maintenance can be scheduled proactively
  - **Pages**: Device Detail Page, Device Status Update Form, Device Inventory List

- **Story 8.6 – Device Maintenance History**
  - **As a** Supervisor
  - **I want to** view and record the maintenance and service history for each tracked medical device including service dates and technician notes
  - **So that** maintenance compliance is documented and devices with overdue service can be flagged for inspection
  - **Pages**: Device Detail Page, Maintenance History Panel, Add Maintenance Record Form

- **Story 8.7 – Asset Association with Case and Patient**
  - **As a** Case Agent
  - **I want to** view all enrolled programs and assigned devices associated with a patient directly from their profile and case pages
  - **So that** a complete picture of the patient's entitlements and equipment is available in context during case handling
  - **Pages**: Patient Profile Page, Case Detail Page, Enrolled Programs Panel, Assigned Devices Panel

---

## 9. Claims & Billing

- **Story 9.1 – Claim Header Creation**
  - **As a** Case Agent
  - **I want to** create a claim header record linked to a healthcare case with payer name, coverage ID, total amount, and submission date
  - **So that** every billable case has a formal claim record ready for payer submission and financial reconciliation
  - **Pages**: Claim Header Creation Form, Case Detail Page, Claim List Page

- **Story 9.2 – Claim Line Item Entry**
  - **As a** Case Agent
  - **I want to** add line items to a claim with service codes, diagnosis codes, procedure codes, quantities, billed amounts, and approved amounts
  - **So that** each claim accurately represents all services rendered and is structured for payer adjudication
  - **Pages**: Claim Line Item Form, Claim Detail Page, Code Lookup Panel

- **Story 9.3 – Payer and Coverage Management**
  - **As a** Case Agent
  - **I want to** manage payer records and link patient HMO coverage information to claims
  - **So that** submitted claims are correctly addressed to the responsible payer and coverage terms are applied to adjudication
  - **Pages**: Payer Management Page, Coverage Detail Page, Claim Header Form

- **Story 9.4 – Claim Status Tracking**
  - **As a** Case Agent
  - **I want to** track and update the status of each claim through its lifecycle (e.g., Draft, Submitted, Under Review, Approved, Rejected, Appealed, Paid)
  - **So that** outstanding claims are monitored and reimbursement timelines are visible to the finance team
  - **Pages**: Claim Detail Page, Claim Status Panel, Claims Dashboard

- **Story 9.5 – PhilHealth DRG Shadow Billing – Secondary Diagnoses**
  - **As a** Case Agent
  - **I want to** enter up to 12 secondary diagnosis codes per case claim in compliance with PhilHealth DRG shadow billing requirements
  - **So that** the PCMS is ready for the DRG billing transition mandated by PhilHealth Circular 2024-0006 without replatforming
  - **Pages**: Claim Detail Page, DRG Coding Panel, Secondary Diagnosis Entry Form

- **Story 9.6 – PhilHealth DRG Shadow Billing – Procedures**
  - **As a** Case Agent
  - **I want to** enter up to 20 procedure codes per case claim in compliance with PhilHealth DRG requirements
  - **So that** all procedures performed during an encounter are captured within the DRG billing data structure
  - **Pages**: Claim Detail Page, DRG Coding Panel, Procedure Code Entry Form

- **Story 9.7 – CF5 XML Generation and Export**
  - **As a** Case Agent
  - **I want to** generate and export the Claim Form 5 (CF5) as a valid PhilHealth-compliant XML file from a completed claim record
  - **So that** claims can be submitted electronically to PhilHealth without manual data re-entry
  - **Pages**: Claim Detail Page, XML Export Panel, CF5 Preview Page

- **Story 9.8 – eSOA XML Generation and Export**
  - **As a** Case Agent
  - **I want to** generate and export the Electronic Statement of Account (eSOA) as a standard XML file from a finalized claim
  - **So that** billing statements can be transmitted to payers and patients in the required electronic format
  - **Pages**: Claim Detail Page, XML Export Panel, eSOA Preview Page

- **Story 9.9 – Claims Dashboard and Aging Report**
  - **As a** Case Agent
  - **I want to** view a summary dashboard showing total claims by status, outstanding amounts, and aging buckets
  - **So that** I can prioritize follow-up on overdue claims and ensure reimbursement flow is not blocked
  - **Pages**: Claims Dashboard, Claims Aging Report Page

---

## 10. FHIR R4 Integration & SMART on FHIR

- **Story 10.1 – Patient Data Sync from Altera Sunrise EMR**
  - **As a** Supervisor
  - **I want to** have a patient's core demographic and clinical data automatically synchronized from Altera Sunrise into the PCMS via FHIR R4
  - **So that** care coordinators work with current EMR-sourced patient information without manually re-entering data from two systems
  - **Pages**: Patient Profile Page, FHIR Sync Status Panel, Patient Registration Form

- **Story 10.2 – Practitioner Lookup via FHIR**
  - **As a** Supervisor
  - **I want to** search for and select a practitioner using a FHIR-backed lookup that queries Altera Sunrise's Practitioner resources
  - **So that** cases are linked to verified, EMR-authoritative clinician records rather than free-text entries
  - **Pages**: Practitioner Lookup Page, Case Creation Form, FHIR Practitioner Search Component

- **Story 10.3 – Contextual EMR Launch via SMART on FHIR**
  - **As a** Clinician
  - **I want to** launch the PCMS as a contextual sidebar or iFrame directly from within the Altera Sunrise EMR with my session and the current patient context automatically passed in
  - **So that** I can view and interact with PCMS case data without leaving my EMR workflow or re-authenticating
  - **Pages**: SMART on FHIR Launch Entry Point, PCMS Clinician Sidebar View, EMR iFrame Wrapper

- **Story 10.4 – Embedded Clinician Sidebar View**
  - **As a** Clinician
  - **I want to** see a compact PCMS case and communication summary for the currently open EMR patient in an embedded sidebar panel
  - **So that** relevant case context (active LOA, pending complaint, prior interactions) is visible without disrupting my clinical documentation
  - **Pages**: PCMS Clinician Sidebar View, Patient Case Summary Panel

- **Story 10.5 – Bidirectional FHIR Resource Updates – Encounter**
  - **As a** Supervisor
  - **I want to** read Encounter resources from Altera Sunrise and write back updates (e.g., linking a case resolution to an encounter) through the FHIR R4 API
  - **So that** care events are kept consistent between the PCMS and the EMR without duplicate manual entry
  - **Pages**: FHIR Sync Configuration Page, Case Detail Page, Encounter Linkage Panel

- **Story 10.6 – Bidirectional FHIR Resource Updates – Condition and ServiceRequest**
  - **As a** Supervisor
  - **I want to** consume Condition and ServiceRequest FHIR resources from Altera Sunrise when building or enriching a patient case
  - **So that** diagnosis and service request context from the EMR is available within the PCMS case without manual transcription
  - **Pages**: Case Detail Page, FHIR Resource Viewer Panel, Condition Linkage Form

- **Story 10.7 – FHIR Resource Coverage Mapping**
  - **As a** System Admin
  - **I want to** configure which FHIR R4 resources are enabled for read and write operations from the Altera Developer API
  - **So that** integration scope is controlled and only authorized FHIR operations are permitted in each deployment environment
  - **Pages**: FHIR Integration Settings Page, Resource Permission Matrix, API Connection Status Page

- **Story 10.8 – SMART on FHIR OAuth Session Handling**
  - **As a** System Admin
  - **I want to** configure the SMART on FHIR OAuth 2.0 and OpenID Connect settings for secure EMR-launched sessions
  - **So that** clinician identity and patient context passed by Altera Sunrise are validated and scoped appropriately before PCMS data is rendered
  - **Pages**: SMART on FHIR Configuration Page, OAuth Settings Panel, FHIR Launch Audit Log

- **Story 10.9 – Near-Real-Time FHIR Data Synchronization**
  - **As a** Supervisor
  - **I want to** trigger or schedule a FHIR data sync for a specific patient to fetch the latest EMR data within an operationally acceptable timeframe
  - **So that** cases referencing clinical data such as diagnoses, medications, or observations reflect the most current EMR state
  - **Pages**: Patient Profile Page, FHIR Sync Status Panel, Manual Sync Trigger Control

- **Story 10.10 – Clinician: Add Clinical Note or Flag Case from Sidebar**
  - **As a** Clinician
  - **I want to** add a brief clinical note to a PCMS case or flag it for care coordinator attention directly from the SMART on FHIR sidebar without leaving the EMR workflow
  - **So that** I can surface relevant clinical observations to the case management team in real time during patient care without switching applications
  - **Pages**: PCMS Clinician Sidebar View, Add Clinical Note Form, Case Flag Modal, Patient Case Summary Panel

- **Story 10.11 – Clinician: View Enriched Patient Clinical Context from FHIR**
  - **As a** Clinician
  - **I want to** view enriched clinical context for the current patient in the PCMS sidebar, including allergies, active medications, immunizations, recent observations, care plans, and diagnostic reports pulled from Altera Sunrise via FHIR R4 resources (AllergyIntolerance, Medication, MedicationRequest, Immunization, Observation, CarePlan, Condition, DiagnosticReport, Goal)
  - **So that** I have a consolidated view of clinically relevant data from the EMR alongside PCMS case status without opening multiple systems
  - **Pages**: PCMS Clinician Sidebar View, Clinical Context Drawer, FHIR Sync Status Panel

---

## 11. Audit, Consent & Compliance

- **Story 11.1 – Consent Recording per Patient**
  - **As a** Supervisor
  - **I want to** record a patient's consent status for data processing, communications, and specific service workflows, with a timestamp and the identity of the staff member who captured consent
  - **So that** all actions taken on behalf of the patient are grounded in documented consent in compliance with the Philippines Data Privacy Act
  - **Pages**: Patient Profile Page, Consent Management Panel, Consent Recording Form

- **Story 11.2 – Consent Withdrawal**
  - **As a** Supervisor
  - **I want to** record a patient's withdrawal of consent for specific processing activities and have the system immediately restrict communications and data use to the revised consent scope
  - **So that** the patient's right to withdraw consent is honored and the hospital is protected from non-compliant data use
  - **Pages**: Consent Management Panel, Consent Withdrawal Form, Patient Profile Page

- **Story 11.3 – Consent History Audit**
  - **As a** Tenant Admin
  - **I want to** view the full consent history for a patient including each consent grant, modification, and withdrawal with timestamps and actor identifiers
  - **So that** consent lifecycle documentation is available for regulatory audits and any dispute about data use can be resolved with an evidence trail
  - **Pages**: Consent History Log, Patient Profile Page, Compliance Audit Report Page

- **Story 11.4 – Audit Log Viewing**
  - **As a** Tenant Admin
  - **I want to** view a comprehensive audit log of all system actions including actor identity, action type, timestamp, and the affected record for any given date range
  - **So that** unauthorized or anomalous activity is detectable and every system action is traceable to a responsible user
  - **Pages**: Audit Log Viewer Page, Audit Filter Panel, Audit Event Detail Page

- **Story 11.5 – PHI Access Tracking**
  - **As a** Tenant Admin
  - **I want to** view a report of every access event to protected health information (PHI) including which user accessed which patient record, when, and from which context
  - **So that** the hospital can demonstrate Data Privacy Act compliance to regulators and identify inappropriate PHI access by staff
  - **Pages**: PHI Access Report Page, Audit Log Viewer Page, Compliance Dashboard

- **Story 11.6 – Data Privacy Act Compliance Reporting**
  - **As a** Tenant Admin
  - **I want to** generate a compliance summary report showing consent coverage rates, PHI access events, audit log completeness, and outstanding consent gaps
  - **So that** the hospital's Data Privacy Officer has a periodic evidence-based view of RA 10173 compliance
  - **Pages**: Compliance Dashboard, DPA Compliance Report Page, Export Report Panel

- **Story 11.7 – JCI Continuity of Care Handoff Audit**
  - **As a** Tenant Admin
  - **I want to** review audit records of patient handoffs between departments or care teams, confirming that patient context and case history were transferred completely
  - **So that** SLMC's JCI accreditation requirements for continuity of care are demonstrably met
  - **Pages**: Handoff Audit Report Page, Case Transfer History Panel, Audit Log Viewer Page

- **Story 11.8 – Role-Based Audit Log Access Control**
  - **As a** System Admin
  - **I want to** restrict access to full audit log data to Tenant Admin and System Admin roles only, while allowing limited self-service audit views for other roles
  - **So that** the integrity of the audit log is protected from modification or selective deletion by users who might be subjects of an investigation
  - **Pages**: Audit Log Viewer Page, Role Permission Settings Page

---

## 12. Multi-Tenancy & Facility Administration

- **Story 12.1 – Facility-Level Data Segregation**
  - **As a** System Admin
  - **I want to** configure the PCMS so that patient records, cases, and communications created at the Quezon City facility are logically isolated from those of the BGC facility at the data layer
  - **So that** a breach or misconfiguration in one campus does not expose the other campus's patient data
  - **Pages**: Tenant Configuration Page, Facility Settings Page, Data Segregation Policy Page

- **Story 12.2 – Tenant-Aware User Access**
  - **As a** System Admin
  - **I want to** assign users to one or more tenants (facilities) so that their access to patient records, cases, and reports is automatically scoped to their authorized facilities
  - **So that** a Case Agent at BGC cannot view or modify records belonging to the Quezon City campus unless explicitly granted cross-facility permissions
  - **Pages**: User Management Page, Tenant Assignment Panel, Access Control Settings

- **Story 12.3 – Shared Service Policy Control**
  - **As a** Tenant Admin
  - **I want to** define policies that allow specific shared services (e.g., central claims processing or a shared care program) to operate across both tenants with controlled visibility
  - **So that** centralized back-office functions can serve both campuses without dismantling the tenant boundary
  - **Pages**: Shared Service Policy Page, Cross-Tenant Permission Configuration, Facility Administration Dashboard

- **Story 12.4 – Cross-Facility Reporting with Tenant Boundaries**
  - **As a** Tenant Admin
  - **I want to** generate aggregate reports that span both facilities while having the option to filter or separate results by tenant
  - **So that** hospital leadership can assess system-wide performance while individual facility managers can review their own operational metrics in isolation
  - **Pages**: Reporting Dashboard, Cross-Facility Report Builder, Tenant Filter Panel, Report Export Page

- **Story 12.5 – Facility Configuration Management**
  - **As a** System Admin
  - **I want to** configure facility-specific settings such as default case types, SLA thresholds, notification templates, and department lists for each tenant independently
  - **So that** operational workflows at Quezon City and BGC can be tuned to each campus's specific policies without one campus's configuration affecting the other
  - **Pages**: Facility Configuration Page, SLA Settings Panel, Notification Template Editor, Department Management Page

- **Story 12.6 – New Facility Onboarding**
  - **As a** System Admin
  - **I want to** provision a new tenant/facility in the PCMS by defining its name, identifiers, default settings, and initial user set through an administrative workflow
  - **So that** the platform can scale to additional SLMC campuses or affiliated hospitals without custom development for each new site
  - **Pages**: New Facility Setup Wizard, Tenant Configuration Page, User Provisioning Page

- **Story 12.7 – Cross-Facility Patient Identification**
  - **As a** Supervisor
  - **I want to** identify when a patient has records at both the Quezon City and BGC facilities and view the relevant context from each site, subject to policy-controlled access
  - **So that** patients who receive care at multiple SLMC campuses have a coherent service experience and staff are not unaware of relevant prior interactions
  - **Pages**: Patient Profile Page, Cross-Facility Patient Context Panel, Multi-Tenant Access Request Form

- **Story 12.8 – Tenant Boundary Enforcement Audit**
  - **As a** Tenant Admin
  - **I want to** review audit log entries that flag any access to records outside of a user's authorized tenant scope
  - **So that** tenant boundary violations are detectable and corrective action can be taken promptly
  - **Pages**: Audit Log Viewer Page, Tenant Boundary Violation Report, Security Alert Dashboard
