import { oc } from "@orpc/contract"

import {
	InviteUserInputSchema,
	InviteUserOutputSchema,
	ListAuditLogsInputSchema,
	ListAuditLogsOutputSchema,
	ListUsersInputSchema,
	ListUsersOutputSchema,
	SetRoleInputSchema,
	SetRoleOutputSchema,
} from "./staff-admin.schema.js"

export const staffAdminContract = {
	users: {
		list: oc
			.route({
				method: "GET",
				path: "/staff-admin/users",
				summary: "List users in tenant (tenant/system admin)",
				tags: ["Staff Admin"],
			})
			.input(ListUsersInputSchema)
			.output(ListUsersOutputSchema),

		invite: oc
			.route({
				method: "POST",
				path: "/staff-admin/users/invite",
				summary: "Invite a new user to the tenant",
				tags: ["Staff Admin"],
			})
			.input(InviteUserInputSchema)
			.output(InviteUserOutputSchema),

		setRole: oc
			.route({
				method: "POST",
				path: "/staff-admin/users/{userId}/role",
				summary: "Change a user's role",
				tags: ["Staff Admin"],
			})
			.input(SetRoleInputSchema)
			.output(SetRoleOutputSchema),
	},

	audit: {
		list: oc
			.route({
				method: "GET",
				path: "/staff-admin/audit",
				summary: "List audit log entries (tenant/system admin)",
				tags: ["Staff Admin"],
			})
			.input(ListAuditLogsInputSchema)
			.output(ListAuditLogsOutputSchema),
	},
}
