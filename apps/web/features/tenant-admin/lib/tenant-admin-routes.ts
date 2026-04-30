export const TENANT_ADMIN_ROUTES = {
	home: "/tenant-admin",
	audit: "/tenant-admin/audit",
	auditLogins: "/tenant-admin/audit/logins",
	compliance: "/tenant-admin/compliance",
	phiAccess: "/tenant-admin/compliance/phi-access",
	dpaReport: "/tenant-admin/compliance/dpa",
	handoffs: "/tenant-admin/compliance/handoffs",
	incidents: "/tenant-admin/incidents",
	facility: "/tenant-admin/facility",
	sharedServices: "/tenant-admin/shared-services",
	boundaryViolations: "/tenant-admin/security/boundary-violations",
	crossFacilityReport: "/tenant-admin/reports/cross-facility",
	designShowcase: "/tenant-admin/__design",
} as const

export const TENANT_ADMIN_ALLOWED_ROLES = ["tenant_admin", "system_admin"] as const
export type TenantAdminAllowedRole = (typeof TENANT_ADMIN_ALLOWED_ROLES)[number]
