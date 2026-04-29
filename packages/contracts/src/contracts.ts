/**
 * Central contract registry
 * Re-exports version routers
 */

// V1 contracts (routers)
export { v1Contract } from "./modules/v1/v1.contract.js"
export type { V1Contract } from "./modules/v1/v1.contract.js"

// Schema types (cases)
export type {
	Case,
	CaseDetail,
	CaseStatus,
	CasePriority,
	CaseVisibility,
	CaseEvent,
	CaseAttachment,
} from "./modules/v1/cases/cases.schema.js"

export { CaseListInputSchema } from "./modules/v1/cases/cases.schema.js"

// Schema types (patients)
export type { Patient, VerifyMrnInput, VerifyMrnOutput } from "./modules/v1/patients/patients.schema.js"

// Schema types (staff-admin)
export type {
	StaffUser,
	AuditLog,
} from "./modules/v1/staff-admin/staff-admin.schema.js"

export {
	ListUsersInputSchema,
	ListAuditLogsInputSchema,
	UserRoleSchema,
} from "./modules/v1/staff-admin/staff-admin.schema.js"

// Schema types (notifications)
export type { Notification } from "./modules/v1/notifications/notifications.schema.js"

// Future versions:
// export { v2Contract, type V2Contract } from "./modules/v2/v2.contract.js"
// export const v2 = { ... }
// export type { Todo as V2Todo, ... } from "./modules/v2/..."
