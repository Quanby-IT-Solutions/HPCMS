export const ADMIN_ROUTES = {
	home: "/admin",
	users: "/admin/users",
	userDetail: (id: string) => `/admin/users/${id}`,
	roles: "/admin/roles",
	security: "/admin/security",
	dataSegregation: "/admin/security/data-segregation",
	tenants: "/admin/tenants",
	tenantDetail: (id: string) => `/admin/tenants/${id}`,
	tenantNew: "/admin/tenants/new",
	caseTypes: "/admin/case-types",
	routingRules: "/admin/routing-rules",
	aiTriage: "/admin/ai-triage",
	fhirSettings: "/admin/fhir-settings",
	designShowcase: "/admin/__design",
} as const

export const ADMIN_ALLOWED_ROLES = ["system_admin"] as const

export type AdminAllowedRole = (typeof ADMIN_ALLOWED_ROLES)[number]
