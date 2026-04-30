/**
 * Typed route constants for the Case Agent workspace (CA-FE-01).
 *
 * Centralized so sidebar nav and deep links share one source of truth.
 */
export const AGENT_ROUTES = {
	home: "/agent",
	inbox: "/agent/inbox",
	inboxLogCall: "/agent/inbox/log-call",
	inboxLogSocial: "/agent/inbox/log-social",
	communicationsSearch: "/agent/communications/search",
	cases: "/agent/cases",
	caseDetail: (id: string) => `/agent/cases/${id}`,
	patients: "/agent/patients",
	patientResults: "/agent/patients/results",
	patientProfile: (id: string) => `/agent/patients/${id}`,
	patientTimeline: (id: string) => `/agent/patients/${id}/timeline`,
	claims: "/agent/claims",
	claimDetail: (id: string) => `/agent/claims/${id}`,
	claimPayers: "/agent/claims/payers",
	claimXmlCf5: (id: string) => `/agent/claims/${id}/export/cf5`,
	claimXmlEsoa: (id: string) => `/agent/claims/${id}/export/esoa`,
	playbooks: "/agent/playbooks",
	designShowcase: "/agent/design-showcase",
} as const

export const AGENT_ALLOWED_ROLES = [
	"case_agent",
	"case_supervisor",
	"tenant_admin",
	"system_admin",
] as const

export type AgentAllowedRole = (typeof AGENT_ALLOWED_ROLES)[number]
