import { oc } from "@orpc/contract"
import { z } from "zod"

import {
	CheckDuplicatesInputSchema,
	CheckDuplicatesOutputSchema,
	ConsentListOutputSchema,
	ConsentMutationOutputSchema,
	ConsentRecordInputSchema,
	ConsentWithdrawInputSchema,
	CrossFacilityContextOutputSchema,
	DeviceDetailSchema,
	DeviceInventoryInputSchema,
	DeviceInventoryOutputSchema,
	DeviceMaintenanceAddInputSchema,
	DeviceStatusUpdateInputSchema,
	EnrollmentDetailSchema,
	EnrollmentListInputSchema,
	EnrollmentListOutputSchema,
	EnrollmentStatusUpdateInputSchema,
	EscalationHistoryOutputSchema,
	FhirLinkResourceInputSchema,
	FhirLinkResourceOutputSchema,
	FhirResourceQueryInputSchema,
	FhirResourceQueryOutputSchema,
	FhirSyncTriggerInputSchema,
	FhirSyncTriggerOutputSchema,
	IncidentAddCaseInputSchema,
	IncidentCreateInputSchema,
	IncidentCreateOutputSchema,
	IncidentDetailSchema,
	IncidentListOutputSchema,
	IncidentRemoveCaseInputSchema,
	IncidentUpdateInputSchema,
	KbArticleCreateInputSchema,
	KbArticleListInputSchema,
	KbArticleListOutputSchema,
	KbArticlePublishInputSchema,
	KbArticleUpdateInputSchema,
	KbCategoryUpsertInputSchema,
	KbMutationOutputSchema,
	MergePatientsInputSchema,
	MergePatientsOutputSchema,
	MrnLinkInputSchema,
	MrnLinkOutputSchema,
	RelatedCaseLinkInputSchema,
	RelatedCaseLinkSchema,
	RelatedCasesOutputSchema,
	RequestCrossFacilityAccessInputSchema,
	RequestCrossFacilityAccessOutputSchema,
	SupervisorCaseCreateInputSchema,
	SupervisorCaseCreateOutputSchema,
	SupervisorDeviceAssignInputSchema,
	SupervisorDeviceAssignOutputSchema,
	SupervisorEnrollInputSchema,
	SupervisorEnrollOutputSchema,
	SupervisorKbArticleSchema,
	SupervisorKbCategorySchema,
	SupervisorPatientRegisterInputSchema,
	SupervisorPatientRegisterOutputSchema,
	CaseAssignInputSchema,
	CaseAssignOutputSchema,
	CaseEscalateInputSchema,
	CaseEscalateOutputSchema,
	TeamWorkloadInputSchema,
	TeamWorkloadOutputSchema,
	TrendAlertAcknowledgeInputSchema,
	TrendAlertAcknowledgeOutputSchema,
	TrendAlertListOutputSchema,
	UnlinkRelatedCaseInputSchema,
	UpdateDemographicsInputSchema,
	UpdateDemographicsOutputSchema,
} from "./supervisor.schema.js"

export const supervisorContract = {
	patients: {
		register: oc
			.route({ method: "POST", path: "/supervisor/patients/register", tags: ["Supervisor"] })
			.input(SupervisorPatientRegisterInputSchema)
			.output(SupervisorPatientRegisterOutputSchema),

		checkDuplicates: oc
			.route({ method: "POST", path: "/supervisor/patients/check-duplicates", tags: ["Supervisor"] })
			.input(CheckDuplicatesInputSchema)
			.output(CheckDuplicatesOutputSchema),

		merge: oc
			.route({ method: "POST", path: "/supervisor/patients/merge", tags: ["Supervisor"] })
			.input(MergePatientsInputSchema)
			.output(MergePatientsOutputSchema),

		updateDemographics: oc
			.route({ method: "PATCH", path: "/supervisor/patients/{patientId}/demographics", tags: ["Supervisor"] })
			.input(UpdateDemographicsInputSchema)
			.output(UpdateDemographicsOutputSchema),

		linkMrn: oc
			.route({ method: "POST", path: "/supervisor/patients/{patientId}/mrn-link", tags: ["Supervisor"] })
			.input(MrnLinkInputSchema)
			.output(MrnLinkOutputSchema),

		triggerSync: oc
			.route({ method: "POST", path: "/supervisor/patients/{patientId}/fhir-sync", tags: ["Supervisor"] })
			.input(FhirSyncTriggerInputSchema)
			.output(FhirSyncTriggerOutputSchema),

		crossFacilityContext: oc
			.route({ method: "GET", path: "/supervisor/patients/{patientId}/cross-facility", tags: ["Supervisor"] })
			.input(z.object({ patientId: z.string() }))
			.output(CrossFacilityContextOutputSchema),

		requestCrossFacilityAccess: oc
			.route({ method: "POST", path: "/supervisor/patients/{patientId}/cross-facility/request", tags: ["Supervisor"] })
			.input(RequestCrossFacilityAccessInputSchema)
			.output(RequestCrossFacilityAccessOutputSchema),
	},

	consent: {
		list: oc
			.route({ method: "GET", path: "/supervisor/patients/{patientId}/consent", tags: ["Supervisor"] })
			.input(z.object({ patientId: z.string() }))
			.output(ConsentListOutputSchema),

		record: oc
			.route({ method: "POST", path: "/supervisor/patients/{patientId}/consent", tags: ["Supervisor"] })
			.input(ConsentRecordInputSchema)
			.output(ConsentMutationOutputSchema),

		withdraw: oc
			.route({ method: "POST", path: "/supervisor/patients/{patientId}/consent/withdraw", tags: ["Supervisor"] })
			.input(ConsentWithdrawInputSchema)
			.output(ConsentMutationOutputSchema),
	},

	cases: {
		create: oc
			.route({ method: "POST", path: "/supervisor/cases", tags: ["Supervisor"] })
			.input(SupervisorCaseCreateInputSchema)
			.output(SupervisorCaseCreateOutputSchema),

		assign: oc
			.route({ method: "POST", path: "/supervisor/cases/{ref}/assign", tags: ["Supervisor"] })
			.input(CaseAssignInputSchema)
			.output(CaseAssignOutputSchema),

		escalate: oc
			.route({ method: "POST", path: "/supervisor/cases/{ref}/escalate", tags: ["Supervisor"] })
			.input(CaseEscalateInputSchema)
			.output(CaseEscalateOutputSchema),

		listEscalationHistory: oc
			.route({ method: "GET", path: "/supervisor/cases/{ref}/escalation-history", tags: ["Supervisor"] })
			.input(z.object({ ref: z.string() }))
			.output(EscalationHistoryOutputSchema),

		linkRelated: oc
			.route({ method: "POST", path: "/supervisor/cases/{ref}/related", tags: ["Supervisor"] })
			.input(RelatedCaseLinkInputSchema)
			.output(RelatedCaseLinkSchema),

		unlinkRelated: oc
			.route({ method: "DELETE", path: "/supervisor/cases/{ref}/related", tags: ["Supervisor"] })
			.input(UnlinkRelatedCaseInputSchema)
			.output(z.object({ success: z.boolean() })),

		listRelated: oc
			.route({ method: "GET", path: "/supervisor/cases/{ref}/related", tags: ["Supervisor"] })
			.input(z.object({ ref: z.string() }))
			.output(RelatedCasesOutputSchema),
	},

	programs: {
		enroll: oc
			.route({ method: "POST", path: "/supervisor/programs/enroll", tags: ["Supervisor"] })
			.input(SupervisorEnrollInputSchema)
			.output(SupervisorEnrollOutputSchema),

		updateEnrollment: oc
			.route({ method: "PATCH", path: "/supervisor/programs/enrollments/{enrollmentId}", tags: ["Supervisor"] })
			.input(EnrollmentStatusUpdateInputSchema)
			.output(EnrollmentDetailSchema),

		getEnrollment: oc
			.route({ method: "GET", path: "/supervisor/programs/enrollments/{enrollmentId}", tags: ["Supervisor"] })
			.input(z.object({ enrollmentId: z.string() }))
			.output(EnrollmentDetailSchema),

		listAll: oc
			.route({ method: "GET", path: "/supervisor/programs/enrollments", tags: ["Supervisor"] })
			.input(EnrollmentListInputSchema)
			.output(EnrollmentListOutputSchema),
	},

	devices: {
		assign: oc
			.route({ method: "POST", path: "/supervisor/devices/assign", tags: ["Supervisor"] })
			.input(SupervisorDeviceAssignInputSchema)
			.output(SupervisorDeviceAssignOutputSchema),

		updateStatus: oc
			.route({ method: "PATCH", path: "/supervisor/devices/{deviceId}/status", tags: ["Supervisor"] })
			.input(DeviceStatusUpdateInputSchema)
			.output(DeviceDetailSchema),

		addMaintenance: oc
			.route({ method: "POST", path: "/supervisor/devices/{deviceId}/maintenance", tags: ["Supervisor"] })
			.input(DeviceMaintenanceAddInputSchema)
			.output(DeviceDetailSchema),

		get: oc
			.route({ method: "GET", path: "/supervisor/devices/{deviceId}", tags: ["Supervisor"] })
			.input(z.object({ deviceId: z.string() }))
			.output(DeviceDetailSchema),

		inventory: oc
			.route({ method: "GET", path: "/supervisor/devices/inventory", tags: ["Supervisor"] })
			.input(DeviceInventoryInputSchema)
			.output(DeviceInventoryOutputSchema),
	},

	incidents: {
		list: oc
			.route({ method: "GET", path: "/supervisor/incidents", tags: ["Supervisor"] })
			.input(z.object({ page: z.coerce.number().default(1), limit: z.coerce.number().default(25) }))
			.output(IncidentListOutputSchema),

		create: oc
			.route({ method: "POST", path: "/supervisor/incidents", tags: ["Supervisor"] })
			.input(IncidentCreateInputSchema)
			.output(IncidentCreateOutputSchema),

		get: oc
			.route({ method: "GET", path: "/supervisor/incidents/{id}", tags: ["Supervisor"] })
			.input(z.object({ id: z.string() }))
			.output(IncidentDetailSchema),

		update: oc
			.route({ method: "PATCH", path: "/supervisor/incidents/{id}", tags: ["Supervisor"] })
			.input(IncidentUpdateInputSchema)
			.output(IncidentDetailSchema),

		addCase: oc
			.route({ method: "POST", path: "/supervisor/incidents/{id}/cases", tags: ["Supervisor"] })
			.input(IncidentAddCaseInputSchema)
			.output(IncidentDetailSchema),

		removeCase: oc
			.route({ method: "DELETE", path: "/supervisor/incidents/{id}/cases", tags: ["Supervisor"] })
			.input(IncidentRemoveCaseInputSchema)
			.output(IncidentDetailSchema),
	},

	kb: {
		listArticles: oc
			.route({ method: "GET", path: "/supervisor/kb/articles", tags: ["Supervisor"] })
			.input(KbArticleListInputSchema)
			.output(KbArticleListOutputSchema),

		getArticle: oc
			.route({ method: "GET", path: "/supervisor/kb/articles/{id}", tags: ["Supervisor"] })
			.input(z.object({ id: z.string() }))
			.output(SupervisorKbArticleSchema),

		createArticle: oc
			.route({ method: "POST", path: "/supervisor/kb/articles", tags: ["Supervisor"] })
			.input(KbArticleCreateInputSchema)
			.output(SupervisorKbArticleSchema),

		updateArticle: oc
			.route({ method: "PATCH", path: "/supervisor/kb/articles/{id}", tags: ["Supervisor"] })
			.input(KbArticleUpdateInputSchema)
			.output(SupervisorKbArticleSchema),

		publish: oc
			.route({ method: "POST", path: "/supervisor/kb/articles/{id}/publish", tags: ["Supervisor"] })
			.input(KbArticlePublishInputSchema)
			.output(KbMutationOutputSchema),

		listCategories: oc
			.route({ method: "GET", path: "/supervisor/kb/categories", tags: ["Supervisor"] })
			.input(z.object({}))
			.output(z.array(SupervisorKbCategorySchema)),

		upsertCategory: oc
			.route({ method: "POST", path: "/supervisor/kb/categories", tags: ["Supervisor"] })
			.input(KbCategoryUpsertInputSchema)
			.output(SupervisorKbCategorySchema),

		deleteCategory: oc
			.route({ method: "DELETE", path: "/supervisor/kb/categories/{id}", tags: ["Supervisor"] })
			.input(z.object({ id: z.string() }))
			.output(z.object({ success: z.boolean() })),
	},

	insights: {
		listAlerts: oc
			.route({ method: "GET", path: "/supervisor/insights/alerts", tags: ["Supervisor"] })
			.input(z.object({}))
			.output(TrendAlertListOutputSchema),

		acknowledgeAlert: oc
			.route({ method: "POST", path: "/supervisor/insights/alerts/{alertId}/acknowledge", tags: ["Supervisor"] })
			.input(TrendAlertAcknowledgeInputSchema)
			.output(TrendAlertAcknowledgeOutputSchema),
	},

	workload: {
		teamWorkload: oc
			.route({ method: "GET", path: "/supervisor/workload/team", tags: ["Supervisor"] })
			.input(TeamWorkloadInputSchema)
			.output(TeamWorkloadOutputSchema),
	},

	fhir: {
		queryResources: oc
			.route({ method: "POST", path: "/supervisor/fhir/query", tags: ["Supervisor"] })
			.input(FhirResourceQueryInputSchema)
			.output(FhirResourceQueryOutputSchema),

		linkResource: oc
			.route({ method: "POST", path: "/supervisor/fhir/link", tags: ["Supervisor"] })
			.input(FhirLinkResourceInputSchema)
			.output(FhirLinkResourceOutputSchema),
	},
}
