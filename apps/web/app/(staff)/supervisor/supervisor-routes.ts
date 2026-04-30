export const SUPERVISOR_ROUTES = {
	home: "/supervisor",
	patients: "/supervisor/patients",
	patientNew: "/supervisor/patients/new",
	patientProfile: (id: string) => `/supervisor/patients/${id}`,
	patientNewCase: (id: string) => `/supervisor/patients/${id}/new-case`,
	patientMerge: (id: string, withId?: string) => `/supervisor/patients/${id}/merge${withId ? `?with=${encodeURIComponent(withId)}` : ""}`,
	cases: "/supervisor/cases",
	caseDetail: (ref: string) => `/supervisor/cases/${ref}`,
	incidents: "/supervisor/incidents",
	incidentNew: "/supervisor/incidents/new",
	incidentDetail: (id: string) => `/supervisor/incidents/${id}`,
	enrollments: "/supervisor/enrollments",
	enrollmentDetail: (id: string) => `/supervisor/enrollments/${id}`,
	devices: "/supervisor/devices",
	deviceDetail: (id: string) => `/supervisor/devices/${id}`,
	knowledgeBase: "/supervisor/knowledge-base",
	kbArticleEdit: (id: string) => `/supervisor/knowledge-base/${id}/edit`,
	kbArticlePreview: (id: string) => `/supervisor/knowledge-base/${id}/preview`,
	kbCategories: "/supervisor/knowledge-base/categories",
	insights: "/supervisor/insights",
	practitioners: "/supervisor/practitioners",
	designShowcase: "/supervisor/design-showcase",
} as const

export const SUPERVISOR_ALLOWED_ROLES = [
	"case_supervisor",
	"tenant_admin",
	"system_admin",
] as const

export type SupervisorAllowedRole = (typeof SUPERVISOR_ALLOWED_ROLES)[number]
