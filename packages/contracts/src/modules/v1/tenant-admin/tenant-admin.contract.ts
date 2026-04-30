import { oc } from "@orpc/contract"
import { z } from "zod"

import {
	AuditListInputSchema,
	AuditListOutputSchema,
	BoundaryViolationListInputSchema,
	BoundaryViolationListOutputSchema,
	BoundaryViolationResolveInputSchema,
	ConsentHistoryListInputSchema,
	ConsentHistoryListOutputSchema,
	CrossFacilityReportInputSchema,
	CrossFacilityReportOutputSchema,
	DpaDashboardOutputSchema,
	DpaReportInputSchema,
	DpaReportOutputSchema,
	FacilityConfigOutputSchema,
	HandoffListInputSchema,
	HandoffListOutputSchema,
	LoginEventListInputSchema,
	LoginEventListOutputSchema,
	NotificationTemplateSchema,
	PatientAuditListInputSchema,
	PatientAuditListOutputSchema,
	PhiAccessReportInputSchema,
	PhiAccessReportOutputSchema,
	SharedPoliciesListInputSchema,
	SharedPoliciesListOutputSchema,
	SharedPolicyCreateInputSchema,
	SharedPolicyDeleteInputSchema,
	SharedPolicySchema,
	SharedPolicyUpdateInputSchema,
	TaIncidentListInputSchema,
	TaIncidentListOutputSchema,
	UpdateSlaInputSchema,
	UpdateTemplateInputSchema,
	UpsertDepartmentInputSchema,
} from "./tenant-admin.schema.js"

export const tenantAdminContract = {
	audit: {
		list: oc
			.route({ method: "GET", path: "/tenant-admin/audit", summary: "List tenant audit events", tags: ["Tenant Admin"] })
			.input(AuditListInputSchema)
			.output(AuditListOutputSchema),

		loginEvents: oc
			.route({ method: "GET", path: "/tenant-admin/audit/logins", summary: "List login events with KPIs", tags: ["Tenant Admin"] })
			.input(LoginEventListInputSchema)
			.output(LoginEventListOutputSchema),
	},

	phiAccess: {
		report: oc
			.route({ method: "GET", path: "/tenant-admin/compliance/phi-access", summary: "PHI access report", tags: ["Tenant Admin"] })
			.input(PhiAccessReportInputSchema)
			.output(PhiAccessReportOutputSchema),
	},

	dpa: {
		dashboard: oc
			.route({ method: "GET", path: "/tenant-admin/compliance", summary: "DPA compliance dashboard", tags: ["Tenant Admin"] })
			.output(DpaDashboardOutputSchema),

		report: oc
			.route({ method: "GET", path: "/tenant-admin/compliance/dpa", summary: "DPA compliance report for period", tags: ["Tenant Admin"] })
			.input(DpaReportInputSchema)
			.output(DpaReportOutputSchema),
	},

	handoffs: {
		list: oc
			.route({ method: "GET", path: "/tenant-admin/compliance/handoffs", summary: "JCI handoff audit list", tags: ["Tenant Admin"] })
			.input(HandoffListInputSchema)
			.output(HandoffListOutputSchema),
	},

	incidents: {
		list: oc
			.route({ method: "GET", path: "/tenant-admin/incidents", summary: "Incident operations list", tags: ["Tenant Admin"] })
			.input(TaIncidentListInputSchema)
			.output(TaIncidentListOutputSchema),
	},

	facility: {
		getConfig: oc
			.route({ method: "GET", path: "/tenant-admin/facility", summary: "Get facility configuration", tags: ["Tenant Admin"] })
			.output(FacilityConfigOutputSchema),

		updateSla: oc
			.route({ method: "PUT", path: "/tenant-admin/facility/sla", summary: "Update SLA settings", tags: ["Tenant Admin"] })
			.input(UpdateSlaInputSchema)
			.output(z.object({ success: z.boolean() })),

		getTemplates: oc
			.route({ method: "GET", path: "/tenant-admin/facility/templates", summary: "Get notification templates", tags: ["Tenant Admin"] })
			.output(z.object({ templates: z.array(NotificationTemplateSchema) })),

		updateTemplate: oc
			.route({ method: "PUT", path: "/tenant-admin/facility/templates/{id}", summary: "Update a notification template", tags: ["Tenant Admin"] })
			.input(UpdateTemplateInputSchema)
			.output(z.object({ success: z.boolean() })),

		getDepartments: oc
			.route({ method: "GET", path: "/tenant-admin/facility/departments", summary: "Get departments", tags: ["Tenant Admin"] })
			.output(z.object({ departments: z.array(z.object({ id: z.string(), name: z.string(), careTeams: z.array(z.string()), headUserId: z.string().nullable(), isActive: z.boolean() })) })),

		upsertDepartment: oc
			.route({ method: "POST", path: "/tenant-admin/facility/departments", summary: "Create or update a department", tags: ["Tenant Admin"] })
			.input(UpsertDepartmentInputSchema)
			.output(z.object({ success: z.boolean() })),
	},

	sharedPolicies: {
		list: oc
			.route({ method: "GET", path: "/tenant-admin/shared-services", summary: "List shared service policies", tags: ["Tenant Admin"] })
			.input(SharedPoliciesListInputSchema)
			.output(SharedPoliciesListOutputSchema),

		create: oc
			.route({ method: "POST", path: "/tenant-admin/shared-services", summary: "Create a shared service policy", tags: ["Tenant Admin"] })
			.input(SharedPolicyCreateInputSchema)
			.output(SharedPolicySchema),

		update: oc
			.route({ method: "PUT", path: "/tenant-admin/shared-services/{id}", summary: "Update a shared service policy", tags: ["Tenant Admin"] })
			.input(SharedPolicyUpdateInputSchema)
			.output(SharedPolicySchema),

		delete: oc
			.route({ method: "DELETE", path: "/tenant-admin/shared-services/{id}", summary: "Delete a shared service policy", tags: ["Tenant Admin"] })
			.input(SharedPolicyDeleteInputSchema)
			.output(z.object({ success: z.boolean() })),
	},

	crossFacility: {
		generate: oc
			.route({ method: "POST", path: "/tenant-admin/reports/cross-facility", summary: "Generate cross-facility report", tags: ["Tenant Admin"] })
			.input(CrossFacilityReportInputSchema)
			.output(CrossFacilityReportOutputSchema),
	},

	boundaryViolations: {
		list: oc
			.route({ method: "GET", path: "/tenant-admin/security/boundary-violations", summary: "List boundary violation events", tags: ["Tenant Admin"] })
			.input(BoundaryViolationListInputSchema)
			.output(BoundaryViolationListOutputSchema),

		resolve: oc
			.route({ method: "POST", path: "/tenant-admin/security/boundary-violations/{id}/resolve", summary: "Mark a boundary violation as resolved", tags: ["Tenant Admin"] })
			.input(BoundaryViolationResolveInputSchema)
			.output(z.object({ success: z.boolean() })),
	},

	patientAudit: {
		list: oc
			.route({ method: "GET", path: "/tenant-admin/patients/{patientId}/audit", summary: "Patient-level audit trail", tags: ["Tenant Admin"] })
			.input(PatientAuditListInputSchema)
			.output(PatientAuditListOutputSchema),
	},

	consentHistory: {
		list: oc
			.route({ method: "GET", path: "/tenant-admin/patients/{patientId}/consent-history", summary: "Patient consent history", tags: ["Tenant Admin"] })
			.input(ConsentHistoryListInputSchema)
			.output(ConsentHistoryListOutputSchema),
	},
}
