import { describe, expect, it } from "vitest"

import * as tenantAdminHooks from "@/features/tenant-admin/api/tenant-admin.hooks"

describe("tenant-admin hooks — export smoke test", () => {
	const hooks: Array<keyof typeof tenantAdminHooks> = [
		"useAuditListQuery",
		"useLoginEventsQuery",
		"usePhiAccessReportQuery",
		"useDpaDashboardQuery",
		"useDpaReportQuery",
		"useHandoffsListQuery",
		"useTaIncidentsListQuery",
		"useFacilityConfigQuery",
		"useUpdateSlaMutation",
		"useUpdateTemplateMutation",
		"useUpsertDepartmentMutation",
		"useSharedPoliciesListQuery",
		"useCreateSharedPolicyMutation",
		"useUpdateSharedPolicyMutation",
		"useDeleteSharedPolicyMutation",
		"useGenerateCrossFacilityReportMutation",
		"useBoundaryViolationsListQuery",
		"useResolveBoundaryViolationMutation",
		"usePatientAuditListQuery",
		"useConsentHistoryListQuery",
	]

	it("exports all expected hooks as functions", () => {
		for (const hookName of hooks) {
			expect(typeof tenantAdminHooks[hookName], `${hookName} should be a function`).toBe("function")
		}
	})
})
