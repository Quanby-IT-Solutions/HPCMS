import { defineRelations } from "drizzle-orm"

import { accounts, sessions, userRoleEnum, users, verifications } from "./auth.js"
import { caseAttachments } from "./attachments.js"
import { auditLogs } from "./audit.js"
import { caseEvents, casePriorityEnum, caseSequences, caseStatusEnum, healthcareCases } from "./cases.js"
import { fhirCache } from "./fhir-cache.js"
import { notifications } from "./notifications.js"
import { patientUserLinks, patients } from "./patients.js"
import { practitioners } from "./practitioners.js"
import { tenants } from "./tenancy.js"
import { tickets, todos } from "./templates.js"

export * from "./auth.js"
export * from "./attachments.js"
export * from "./audit.js"
export * from "./cases.js"
export * from "./fhir-cache.js"
export * from "./notifications.js"
export * from "./patients.js"
export * from "./practitioners.js"
export * from "./tenancy.js"
export * from "./templates.js"

export const relations = defineRelations(
	{
		users,
		sessions,
		accounts,
		verifications,
		tenants,
		patients,
		patientUserLinks,
		practitioners,
		caseSequences,
		healthcareCases,
		caseEvents,
		caseAttachments,
		notifications,
		auditLogs,
		fhirCache,
		todos,
		tickets,
	},
	r => ({
		users: {
			sessions: r.many.sessions(),
			accounts: r.many.accounts(),
			todos: r.many.todos(),
			tickets: r.many.tickets(),
			patientLinks: r.many.patientUserLinks(),
			assignedCases: r.many.healthcareCases(),
			notifications: r.many.notifications(),
			auditLogs: r.many.auditLogs(),
			caseEvents: r.many.caseEvents(),
			caseAttachments: r.many.caseAttachments(),
			tenant: r.one.tenants({
				from: r.users.tenantId,
				to: r.tenants.id,
			}),
		},
		tenants: {
			users: r.many.users(),
			patients: r.many.patients(),
			practitioners: r.many.practitioners(),
			healthcareCases: r.many.healthcareCases(),
			caseSequences: r.many.caseSequences(),
			notifications: r.many.notifications(),
			auditLogs: r.many.auditLogs(),
			fhirCache: r.many.fhirCache(),
		},
		sessions: {
			user: r.one.users({
				from: r.sessions.userId,
				to: r.users.id,
			}),
		},
		accounts: {
			user: r.one.users({
				from: r.accounts.userId,
				to: r.users.id,
			}),
		},
		patients: {
			tenant: r.one.tenants({
				from: r.patients.tenantId,
				to: r.tenants.id,
			}),
			userLinks: r.many.patientUserLinks(),
			healthcareCases: r.many.healthcareCases(),
		},
		patientUserLinks: {
			patient: r.one.patients({
				from: r.patientUserLinks.patientId,
				to: r.patients.id,
			}),
			user: r.one.users({
				from: r.patientUserLinks.userId,
				to: r.users.id,
			}),
		},
		practitioners: {
			tenant: r.one.tenants({
				from: r.practitioners.tenantId,
				to: r.tenants.id,
			}),
			healthcareCases: r.many.healthcareCases(),
		},
		caseSequences: {
			tenant: r.one.tenants({
				from: r.caseSequences.tenantId,
				to: r.tenants.id,
			}),
		},
		healthcareCases: {
			tenant: r.one.tenants({
				from: r.healthcareCases.tenantId,
				to: r.tenants.id,
			}),
			patient: r.one.patients({
				from: r.healthcareCases.patientId,
				to: r.patients.id,
			}),
			practitioner: r.one.practitioners({
				from: r.healthcareCases.practitionerId,
				to: r.practitioners.id,
			}),
			assignedUser: r.one.users({
				from: r.healthcareCases.assignedUserId,
				to: r.users.id,
			}),
			attachments: r.many.caseAttachments(),
			events: r.many.caseEvents(),
		},
		caseEvents: {
			case: r.one.healthcareCases({
				from: r.caseEvents.caseId,
				to: r.healthcareCases.id,
			}),
			tenant: r.one.tenants({
				from: r.caseEvents.tenantId,
				to: r.tenants.id,
			}),
			actor: r.one.users({
				from: r.caseEvents.actorUserId,
				to: r.users.id,
			}),
		},
		caseAttachments: {
			case: r.one.healthcareCases({
				from: r.caseAttachments.caseId,
				to: r.healthcareCases.id,
			}),
			tenant: r.one.tenants({
				from: r.caseAttachments.tenantId,
				to: r.tenants.id,
			}),
			uploadedBy: r.one.users({
				from: r.caseAttachments.uploadedByUserId,
				to: r.users.id,
			}),
		},
		notifications: {
			tenant: r.one.tenants({
				from: r.notifications.tenantId,
				to: r.tenants.id,
			}),
			user: r.one.users({
				from: r.notifications.userId,
				to: r.users.id,
			}),
		},
		auditLogs: {
			tenant: r.one.tenants({
				from: r.auditLogs.tenantId,
				to: r.tenants.id,
			}),
			actor: r.one.users({
				from: r.auditLogs.actorUserId,
				to: r.users.id,
			}),
		},
		fhirCache: {
			tenant: r.one.tenants({
				from: r.fhirCache.tenantId,
				to: r.tenants.id,
			}),
		},
		todos: {
			author: r.one.users({
				from: r.todos.authorId,
				to: r.users.id,
			}),
		},
		tickets: {
			author: r.one.users({
				from: r.tickets.authorId,
				to: r.users.id,
			}),
		},
	})
)

export const schema = Object.assign(
	{
		users,
		sessions,
		accounts,
		verifications,
		tenants,
		patients,
		patientUserLinks,
		practitioners,
		caseSequences,
		healthcareCases,
		caseEvents,
		caseAttachments,
		notifications,
		auditLogs,
		fhirCache,
		todos,
		tickets,
		// enums — included so drizzle-kit sees them in the schema object
		userRoleEnum,
		caseStatusEnum,
		casePriorityEnum,
	},
	relations
)
