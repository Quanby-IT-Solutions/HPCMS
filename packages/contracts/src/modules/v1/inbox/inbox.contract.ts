import { oc } from "@orpc/contract"

import {
	AcceptSuggestionInputSchema,
	AttachToCaseInputSchema,
	InboxIdInputSchema,
	InboxItemDetailSchema,
	InboxListInputSchema,
	InboxListOutputSchema,
	InboxMutationOutputSchema,
	InboxSearchInputSchema,
	InboxSearchOutputSchema,
	OverrideSuggestionInputSchema,
	ResolveInboxInputSchema,
	SuggestionMutationOutputSchema,
} from "./inbox.schema.js"

export const inboxContract = {
	list: oc
		.route({
			method: "GET",
			path: "/inbox",
			summary: "Unified inbox feed across channels",
			tags: ["Inbox"],
		})
		.input(InboxListInputSchema)
		.output(InboxListOutputSchema),

	get: oc
		.route({
			method: "GET",
			path: "/inbox/{id}",
			summary: "Get a single inbox item with channel-specific detail",
			tags: ["Inbox"],
		})
		.input(InboxIdInputSchema)
		.output(InboxItemDetailSchema),

	attachToCase: oc
		.route({
			method: "POST",
			path: "/inbox/attach-to-case",
			summary: "Link an inbox item to an existing case",
			tags: ["Inbox"],
		})
		.input(AttachToCaseInputSchema)
		.output(InboxMutationOutputSchema),

	resolve: oc
		.route({
			method: "POST",
			path: "/inbox/resolve",
			summary: "Mark an inbox item resolved",
			tags: ["Inbox"],
		})
		.input(ResolveInboxInputSchema)
		.output(InboxMutationOutputSchema),

	search: oc
		.route({
			method: "GET",
			path: "/inbox/search",
			summary: "Cross-channel communication search with filters",
			tags: ["Inbox"],
		})
		.input(InboxSearchInputSchema)
		.output(InboxSearchOutputSchema),

	suggestion: {
		accept: oc
			.route({
				method: "POST",
				path: "/inbox/suggestion/accept",
				summary: "Accept the AI category suggestion and route to a new case",
				tags: ["Inbox"],
			})
			.input(AcceptSuggestionInputSchema)
			.output(SuggestionMutationOutputSchema),

		override: oc
			.route({
				method: "POST",
				path: "/inbox/suggestion/override",
				summary: "Override the AI suggestion with a corrected category + reason",
				tags: ["Inbox"],
			})
			.input(OverrideSuggestionInputSchema)
			.output(SuggestionMutationOutputSchema),
	},
}
