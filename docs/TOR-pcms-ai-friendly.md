# AI-Friendly TOR: Custom Hospital Patient Case Management System (PCMS)

## Document Purpose
This document restructures the original Terms of Reference (TOR) into an AI-friendly format that can be used for planning, solution design, implementation scoping, architecture review, backlog generation, and system prompt grounding.

## Project Summary
- Project name: Custom Hospital Patient Case Management System (PCMS)
- Client: St. Luke's Medical Center (SLMC)
- Domain: Healthcare / hospital operations / patient service management
- Deployment context: Must embed into or operate alongside Altera Sunrise EMR
- System type: Proprietary enterprise-grade patient case management platform modeled after healthcare CRM capabilities

## Primary Objective
Design, develop, and deploy a proprietary Patient Case Management System for SLMC that provides:
- Centralized patient case handling
- Omni-channel patient engagement
- AI-assisted proactive service workflows
- Secure patient self-service web and mobile portals
- Major incident management
- Asset and contract tracking

The system must integrate with Altera Sunrise EMR using FHIR R4 and support SMART on FHIR embedded workflows.

## Core Business Goal
Enable administrative care coordinators and back-office teams to manage patient-related operational and service cases without disrupting front-office clinicians working directly inside the EMR.

## Intended Users
- Administrative care coordinators
- Back-office service agents
- Physicians
- Nurses
- Patients
- Hospital administrators
- Incident managers
- Claims and finance personnel

## High-Level Scope

### In Scope
- Custom case management platform
- Patient 360 communication timeline
- AI-assisted categorization and recommendations
- Web and mobile patient self-service portal
- Knowledge base and chatbot
- Major issue / incident aggregation module
- Patient entitlement and device tracking
- FHIR R4 integration with Altera Sunrise EMR
- SMART on FHIR embedded clinician experience
- Consent management, audit logging, encryption, and multi-tenancy support
- PhilHealth eClaims and DRG shadow billing readiness

### Out of Scope Unless Later Approved
- Replacement of the core EMR
- Direct modification of Altera Sunrise internals beyond supported integration methods
- Unsupported interoperability protocols outside FHIR R4 unless required by a downstream subsystem
- Non-healthcare CRM features not tied to patient case workflows

## Functional Requirements

### FR-01 Centralized Case Management
The system must provide a unified dashboard to track, route, assign, escalate, and resolve patient care issues.

Requirements:
- Single queue or dashboard for operational case visibility
- Case routing based on workflow type, priority, department, or rules
- Support back-office processing without interrupting clinicians inside EMR workflows
- Link each case to patient, practitioner, service type, and communication history
- Support extendable case types

### FR-02 Omni-Channel Engagement / Patient 360
The system must aggregate all patient communications into a single timeline associated with the patient's master record.

Channels to support:
- Email
- Phone call logs
- Social media inquiries
- Secure portal chat

Requirements:
- Unified patient communication timeline
- Conversation continuity across channels
- Attach communication events to patient and case records
- Search and filter interactions by time, channel, issue type, and status

### FR-03 Proactive Customer Service (AI-Driven)
The system must implement AI or rule-based automation to assist service operations.

Capabilities:
- Auto-categorize incoming patient requests
- Detect recurring or systemic trends
- Recommend guided playbooks for service agents
- Surface likely escalation risks before cases worsen

Implementation note:
Initial release may use deterministic rules and workflow logic, with later expansion into machine learning models if sufficient training data becomes available.

### FR-04 Self-Service Patient Portal
The system must provide secure web and mobile self-service access for patients.

Patient capabilities:
- Submit HMO Letter of Authorization (LOA) requests
- Search a medical knowledge base
- Interact with an AI chatbot for triage, scheduling, and FAQs

#### FR-04A LOA Request Form
The LOA form must capture these exact fields:
- Admitting Order file upload
- HMO Card Number
- Date of Consultation/Procedure
- Preferred Doctor Name
- Chief Complaint
- Valid ID upload
- HMO ID upload

Requirements:
- File upload support with secure validation
- Input validation and required-field enforcement
- Attachment linkage to patient and case records
- Submission confirmation and status tracking

### FR-05 Major Issue Management
The system must support incident or major issue aggregation.

Examples:
- Infectious disease outbreak tracking
- Systemic IT outage management

Requirements:
- Aggregate similar cases into a major incident
- Track affected departments, patients, systems, or locations
- Enable rapid visibility for operations teams
- Support incident status, severity, root cause notes, and resolution tracking

### FR-06 Asset and Contract Management
The system must track patient entitlements, care program enrollments, and assigned physical medical devices.

Requirements:
- Track patient program eligibility and enrollment lifecycle
- Track assigned medical devices and device lifecycle state
- Associate assets and entitlements with cases and patients
- Support maintenance and replacement history

## Required Data Model / Database Schema
The platform must use a highly relational schema with extendable healthcare case modeling.

### DM-01 Patient Entity
Stores:
- Core demographics
- Birth data
- Ethnicity
- Consent flags

Suggested attributes:
- patient_id
- facility_id or tenant_id
- medical_record_number
- full_name
- sex_at_birth
- date_of_birth
- ethnicity
- contact details
- consent indicators
- audit metadata

### DM-02 Practitioner Entity
Stores:
- Clinician identity
- Specialization
- Location authorizations

Suggested attributes:
- practitioner_id
- full_name
- specialty
- license identifiers
- authorized facilities
- department affiliations
- active status

### DM-03 Healthcare Case Entity
This is the root workflow table.

Requirements:
- Link patient, practitioner, service request, and operational workflow
- Support customizable case types
- Allow use cases such as:
  - Drug Program Enrollment
  - Billing Inquiry
  - LOA Request
  - Complaint Resolution
  - Care Coordination Issue

Suggested attributes:
- healthcare_case_id
- patient_id
- practitioner_id
- case_type
- status
- priority
- source_channel
- category
- subcategory
- opened_at
- due_at
- resolved_at
- escalated_flag
- incident_id
- assigned_team
- assigned_user

### DM-04 Enrolled Program Entity
Tracks patient enrollment in specialized care pathways.

Examples:
- Diabetes Management
- Oncology Support

Suggested attributes:
- enrolled_program_id
- patient_id
- program_name
- enrollment_status
- effective_date
- end_date
- coordinator_id

### DM-05 Medical Device Install Base Entity
Tracks physical medical devices assigned to patient cases.

Examples:
- IoT monitors
- CPAP machines

Suggested attributes:
- device_install_base_id
- device_id
- patient_id
- healthcare_case_id
- serial_number
- device_type
- assignment_date
- maintenance_status
- last_service_date

### DM-06 Claim Header Entity
Stores payer-facing financial claim data associated with a healthcare case.

Suggested attributes:
- claim_header_id
- healthcare_case_id
- payer_name
- coverage_id
- claim_status
- total_amount
- submission_date
- xml_payload_reference

### DM-07 Claim Line Entity
Stores line-item claim details linked to a claim header.

Suggested attributes:
- claim_line_id
- claim_header_id
- service_code
- diagnosis_code
- procedure_code
- quantity
- billed_amount
- approved_amount

## Integration Requirements

### IR-01 EMR Integration Target
Target EMR: Altera Sunrise

The PCMS must embed directly into or operate seamlessly alongside Altera Sunrise across the Quezon City and Global City campuses.

### IR-02 Interoperability Standard
Bidirectional data exchange must use HL7 FHIR R4.

### IR-03 Supported FHIR Resources
The backend must map, consume, and update the following FHIR R4 resources supported by the Altera Developer API:
- AllergyIntolerance
- CarePlan
- CareTeam
- Condition
- Coverage
- Device
- DiagnosticReport
- DocumentReference
- Encounter
- Goal
- Immunization
- Location
- Medication
- MedicationRequest
- Observation
- Organization
- Patient
- Practitioner
- Procedure
- ServiceRequest
- Specimen

### IR-04 SMART on FHIR Embedded Experience
The front end must support SMART on FHIR so the PCMS can be embedded in clinician workflows as an iFrame or contextual sidebar.

Authentication and authorization requirements:
- OAuth 2.0
- OpenID Connect
- Context-aware launch from EMR workflow
- Secure session handling

### IR-05 Data Synchronization Expectations
The system should support:
- Read and write operations against permitted FHIR resources
- Contextual patient launch where patient identity is provided by EMR context
- Practitioner-aware authorization when launched from clinician sessions
- Near-real-time or operationally acceptable synchronization between PCMS and EMR

## Security, Compliance, and Privacy Requirements

### SC-01 Data Privacy Act Compliance
The system must comply with the Philippines Data Privacy Act of 2012 (Republic Act No. 10173).

Requirements:
- Strict consent management
- Audit logging for all PHI access and actions
- Role-based access controls
- Data minimization where appropriate

### SC-02 Encryption Standards
All digital health data must be encrypted:
- At rest using AES-256 or equivalent compliant implementation
- In transit using modern TLS

Additional requirement:
- Password policy enforcement must be managed through system administration tooling

### SC-03 JCI Continuity of Care Support
Because SLMC is JCI-accredited, workflows must support continuity of care.

Requirements:
- Patient profiles remain current across departments
- Relevant case and patient context transfers consistently during handoffs
- Department transitions do not fragment service history

### SC-04 Domain Separation / Multi-Tenancy
The data model must support logical partitioning across facilities.

Required tenancy scenario:
- Quezon City facility
- Bonifacio Global City facility

Requirements:
- Sensitive records can be isolated by hospital policy
- Shared services may still operate with policy-controlled access
- Reporting and access controls respect tenant boundaries

## Future-Proofing Requirements

### FP-01 PhilHealth eClaims and DRG Shadow Billing Readiness
The platform must support the Philippines DRG shadow billing transition described in PhilHealth Circular 2024-0006.

Requirements:
- Up to 12 secondary diagnoses per case
- Up to 20 procedures per case
- Case-level claim aggregation suitable for DRG workflows

### FP-02 XML Payload Generation
The backend must generate and transmit these outputs in standard XML format:
- Claim Form 5 (CF5)
- Electronic Statement of Account (eSOA)

## Non-Functional Requirements

### NFR-01 Reliability
- Must support hospital operational usage and critical service workflows
- Downtime impact should be minimized for patient operations

### NFR-02 Auditability
- All access to PHI and case actions must be traceable
- Audit logs should include actor, action, timestamp, context, and affected record

### NFR-03 Extensibility
- Case model must support new case types without major redesign
- Integration layer should allow additional FHIR resources later if Altera support expands

### NFR-04 Security by Design
- Principle of least privilege
- Tenant-aware authorization
- Secure attachment handling
- Strong session and token management

### NFR-05 Usability
- Administrative users need efficient triage and queue management
- Patient portal must be simple enough for non-technical users
- Embedded clinician views must avoid disrupting EMR workflow

## Suggested Product Modules
- Patient Master / Patient 360
- Case Management
- Omni-Channel Inbox
- AI Triage and Recommendation Engine
- Patient Portal Web App
- Patient Mobile App
- Knowledge Base
- Chatbot and Virtual Assistant
- Major Incident Management
- Program Enrollment Management
- Medical Device Tracking
- Claims and Billing Integration
- Audit and Consent Management
- FHIR Integration Layer
- SMART on FHIR Launch Module
- Multi-Tenant Access Control

## Suggested Architecture Components
- Frontend web portal for patients
- Mobile application for patients
- Embedded clinician-facing web module for EMR launch
- Backend API layer
- FHIR integration service
- Case workflow engine
- Notification service
- AI/rules engine
- Relational database
- Secure object storage for uploads and documents
- Audit logging subsystem
- XML claims export subsystem

## Suggested Backlog Themes
- Theme 1: Foundation and multi-tenant identity
- Theme 2: Core patient and practitioner master data
- Theme 3: Healthcare case workflow engine
- Theme 4: Patient 360 omni-channel communication timeline
- Theme 5: LOA request workflow and document handling
- Theme 6: SMART on FHIR embedded experience
- Theme 7: FHIR R4 mapping and synchronization
- Theme 8: AI triage and proactive service intelligence
- Theme 9: Incident and outbreak management
- Theme 10: Claims, PhilHealth XML, and DRG readiness
- Theme 11: Compliance, consent, and audit controls

## AI-Readable Requirement Inventory

| ID | Category | Requirement | Priority |
| --- | --- | --- | --- |
| FR-01 | Functional | Unified case dashboard and routing | Critical |
| FR-02 | Functional | Patient 360 omni-channel communication timeline | Critical |
| FR-03 | Functional | AI-driven proactive service recommendations | High |
| FR-04 | Functional | Patient self-service web and mobile portal | Critical |
| FR-04A | Functional | LOA form with exact SLMC fields and uploads | Critical |
| FR-05 | Functional | Major issue / incident aggregation module | High |
| FR-06 | Functional | Asset, entitlement, and contract tracking | High |
| DM-01 | Data | Patient master entity | Critical |
| DM-02 | Data | Practitioner entity | Critical |
| DM-03 | Data | Extendable healthcare case entity | Critical |
| DM-04 | Data | Enrolled program entity | High |
| DM-05 | Data | Medical device install base entity | High |
| DM-06 | Data | Claim header entity | High |
| DM-07 | Data | Claim line entity | High |
| IR-01 | Integration | Integrate with Altera Sunrise EMR | Critical |
| IR-02 | Integration | Bidirectional HL7 FHIR R4 exchange | Critical |
| IR-03 | Integration | Support listed FHIR resources | Critical |
| IR-04 | Integration | SMART on FHIR embedded launch | Critical |
| SC-01 | Security | Philippines Data Privacy Act compliance | Critical |
| SC-02 | Security | AES-256 encryption and secure transport | Critical |
| SC-03 | Compliance | JCI continuity of care support | High |
| SC-04 | Security | Multi-tenant logical domain separation | Critical |
| FP-01 | Future | DRG shadow billing readiness | High |
| FP-02 | Future | XML generation for CF5 and eSOA | High |

## Constraints
- Must work with Altera Sunrise rather than replace it
- Must use supported FHIR R4 resources exposed by Altera Developer API
- Must support SMART on FHIR embedding model
- Must comply with Philippine privacy requirements
- Must support hospital-specific operational workflows and SLMC LOA process

## Key Risks
- Altera Sunrise integration limitations may constrain workflow depth or write-back capabilities
- SMART on FHIR launch context and iframe embedding may vary by deployment configuration
- AI features may require phased rollout if data quality is insufficient initially
- Multi-campus data segregation policies may introduce complex authorization rules
- PhilHealth XML compliance may require strict schema conformance and iterative certification testing

## Open Questions for Discovery
- What exact user roles and permission matrix will SLMC require?
- Which communication channels are needed in phase 1 versus later phases?
- Will social media integration be direct API ingestion or manual case capture?
- What response time and SLA targets apply to each case type?
- What Altera Sunrise sandbox, scopes, and FHIR write permissions are available?
- What file size, file type, and retention rules apply to LOA uploads?
- Should patient portal and chatbot support English only or English plus Filipino?
- What exact XML schemas and transport method are required for PhilHealth eClaims 3.0?
- How strict is facility-level segregation between Quezon City and Global City for shared patients?

## Recommended Delivery Strategy

### Phase 1
- Core patient, practitioner, and case entities
- Centralized case dashboard
- LOA request workflow
- Patient portal authentication and uploads
- Basic FHIR patient and practitioner integration
- Consent and audit logging foundation

### Phase 2
- Omni-channel timeline
- SMART on FHIR embedded clinician view
- More FHIR resources and bidirectional updates
- Knowledge base and chatbot MVP
- Program and device tracking

### Phase 3
- AI-driven recommendations and trend detection
- Major incident aggregation
- Claims XML generation
- DRG shadow billing support
- Advanced reporting and analytics

## One-Sentence System Definition
The PCMS is a multi-tenant, FHIR-integrated, SMART on FHIR-capable hospital case management platform for SLMC that centralizes patient service operations, patient communications, AI-assisted triage, self-service requests, and claims-related workflows without disrupting the existing Altera Sunrise EMR.
