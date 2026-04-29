import { oc } from "@orpc/contract"

import {
	ListNotificationsInputSchema,
	ListNotificationsOutputSchema,
	MarkAllReadOutputSchema,
	MarkReadInputSchema,
	MarkReadOutputSchema,
} from "./notifications.schema.js"

export const notificationsContract = {
	list: oc
		.route({
			method: "GET",
			path: "/notifications",
			summary: "List own notifications (tenant-scoped)",
			tags: ["Notifications"],
		})
		.input(ListNotificationsInputSchema)
		.output(ListNotificationsOutputSchema),

	markRead: oc
		.route({
			method: "POST",
			path: "/notifications/mark-read",
			summary: "Mark specific notifications as read",
			tags: ["Notifications"],
		})
		.input(MarkReadInputSchema)
		.output(MarkReadOutputSchema),

	markAllRead: oc
		.route({
			method: "POST",
			path: "/notifications/mark-all-read",
			summary: "Mark all own notifications as read",
			tags: ["Notifications"],
		})
		.output(MarkAllReadOutputSchema),
}
