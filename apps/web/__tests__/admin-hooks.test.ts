/**
 * Smoke test — verifies that all admin hook exports exist and are functions.
 * Does not invoke hooks (requires React context); just checks the module shape.
 */
import { describe, expect, it } from "vitest"

import * as adminHooks from "@/features/staff-admin/api/admin.hooks"

describe("admin hooks — export smoke test", () => {
	const hooks: Array<keyof typeof adminHooks> = [
		// Users
		"useAdminUsersQuery",
		"useAdminUserQuery",
		"useUserSessionsQuery",
		"useInviteUserMutation",
		"useSetRoleMutation",
		"useDeactivateUserMutation",
		"useActivateUserMutation",
		// Audit
		"useAuditLogsQuery",
		// Roles
		"useRoleMatrixQuery",
		"useUpdateRoleMatrixMutation",
		// Security
		"useSecurityPolicyQuery",
		"useUpdateSecurityPolicyMutation",
		"useActiveSessionsQuery",
		"useTerminateSessionMutation",
		"useResetMfaMutation",
		// Tenants
		"useTenantsQuery",
		"useTenantQuery",
		"useEffectiveAccessMatrixQuery",
		"useAssignUserTenantMutation",
		// Case Types
		"useCaseTypesQuery",
		"useCreateCaseTypeMutation",
		"useUpdateCaseTypeMutation",
		"useArchiveCaseTypeMutation",
		"useReactivateCaseTypeMutation",
		// Routing Rules
		"useRoutingRulesQuery",
		"useCreateRoutingRuleMutation",
		"useUpdateRoutingRuleMutation",
		"useReorderRoutingRulesMutation",
		"useToggleRoutingRuleMutation",
		"useRoutingLogQuery",
		// AI Triage
		"useTriageCategoriesQuery",
		"useCreateTriageCategoryMutation",
		"useUpdateTriageCategoryMutation",
		"useReorderTriageCategoriesMutation",
		"useSimulateTriageMutation",
		// FHIR Settings
		"useFhirPermissionsQuery",
		"useUpdateFhirPermissionsMutation",
		"useFhirOAuthQuery",
		"useUpdateFhirOAuthMutation",
		"useFhirTestConnectionMutation",
		// Facilities
		"useProvisionFacilityMutation",
		// Data Segregation
		"useDataSegregationMatrixQuery",
	]

	it("exports all expected hooks as functions", () => {
		for (const hookName of hooks) {
			expect(typeof adminHooks[hookName], `${hookName} should be a function`).toBe("function")
		}
	})
})
