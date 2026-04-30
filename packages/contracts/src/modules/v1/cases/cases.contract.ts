import { oc } from "@orpc/contract"

import {
	AddEventInputSchema,
	ApproveInputSchema,
	AssignInputSchema,
	CaseDetailSchema,
	CaseListInputSchema,
	CaseMutationOutputSchema,
	ClaimInputSchema,
	CloseInputSchema,
	GetCaseInputSchema,
	LoaSubmitInputSchema,
	LoaSubmitOutputSchema,
	MyRequestsInputSchema,
	PaginatedCasesOutputSchema,
	QueueKpisOutputSchema,
	QueueListInputSchema,
	QueueListOutputSchema,
	RejectInputSchema,
	RequestUploadsInputSchema,
	RequestUploadsOutputSchema,
	ResolveInputSchema,
	WithdrawInputSchema,
} from "./cases.schema.js"

export const casesContract = {
	loa: {
		requestUploads: oc
			.route({
				method: "POST",
				path: "/cases/loa/request-uploads",
				summary: "Request presigned upload URLs for LOA attachments",
				tags: ["Cases"],
			})
			.input(RequestUploadsInputSchema)
			.output(RequestUploadsOutputSchema),

		submit: oc
			.route({
				method: "POST",
				path: "/cases/loa/submit",
				summary: "Submit LOA case with payload and attachments",
				tags: ["Cases"],
			})
			.input(LoaSubmitInputSchema)
			.output(LoaSubmitOutputSchema),
	},

	myRequests: oc
		.route({
			method: "GET",
			path: "/cases/my-requests",
			summary: "Patient: list own LOA requests",
			tags: ["Cases"],
		})
		.input(MyRequestsInputSchema)
		.output(PaginatedCasesOutputSchema),

	get: oc
		.route({
			method: "GET",
			path: "/cases/{ref}",
			summary: "Get case detail by reference (patient sees own; staff sees tenant-wide)",
			tags: ["Cases"],
		})
		.input(GetCaseInputSchema)
		.output(CaseDetailSchema),

	withdraw: oc
		.route({
			method: "POST",
			path: "/cases/{ref}/withdraw",
			summary: "Patient: withdraw a submitted or in-review LOA request",
			tags: ["Cases"],
		})
		.input(WithdrawInputSchema)
		.output(CaseMutationOutputSchema),

	list: oc
		.route({
			method: "GET",
			path: "/cases",
			summary: "Staff: list cases in the queue with filters and sorting",
			tags: ["Cases"],
		})
		.input(CaseListInputSchema)
		.output(PaginatedCasesOutputSchema),

	claim: oc
		.route({
			method: "POST",
			path: "/cases/{ref}/claim",
			summary: "Staff: claim a case and transition submitted → in_review",
			tags: ["Cases"],
		})
		.input(ClaimInputSchema)
		.output(CaseMutationOutputSchema),

	assign: oc
		.route({
			method: "POST",
			path: "/cases/{ref}/assign",
			summary: "Supervisor: assign case to a staff member",
			tags: ["Cases"],
		})
		.input(AssignInputSchema)
		.output(CaseMutationOutputSchema),

	approve: oc
		.route({
			method: "POST",
			path: "/cases/{ref}/approve",
			summary: "Staff: approve LOA request",
			tags: ["Cases"],
		})
		.input(ApproveInputSchema)
		.output(CaseMutationOutputSchema),

	reject: oc
		.route({
			method: "POST",
			path: "/cases/{ref}/reject",
			summary: "Staff: reject LOA request with reason",
			tags: ["Cases"],
		})
		.input(RejectInputSchema)
		.output(CaseMutationOutputSchema),

	close: oc
		.route({
			method: "POST",
			path: "/cases/{ref}/close",
			summary: "Staff: close a resolved case",
			tags: ["Cases"],
		})
		.input(CloseInputSchema)
		.output(CaseMutationOutputSchema),

	addEvent: oc
		.route({
			method: "POST",
			path: "/cases/{ref}/events",
			summary: "Staff: add internal note or event to a case",
			tags: ["Cases"],
		})
		.input(AddEventInputSchema)
		.output(CaseMutationOutputSchema),

	queue: {
		list: oc
			.route({
				method: "GET",
				path: "/cases/queue",
				summary: "Case Agent queue: list cases with SLA + risk + assignment data",
				tags: ["Cases"],
			})
			.input(QueueListInputSchema)
			.output(QueueListOutputSchema),

		kpis: oc
			.route({
				method: "GET",
				path: "/cases/queue/kpis",
				summary: "KPI counts for the case queue dashboard",
				tags: ["Cases"],
			})
			.output(QueueKpisOutputSchema),
	},

	resolve: oc
		.route({
			method: "POST",
			path: "/cases/{ref}/resolve",
			summary: "Resolve a case with one of four resolution categories",
			tags: ["Cases"],
		})
		.input(ResolveInputSchema)
		.output(CaseMutationOutputSchema),
}
