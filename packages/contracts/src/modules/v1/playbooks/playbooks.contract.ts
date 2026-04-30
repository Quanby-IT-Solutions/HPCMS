import { oc } from "@orpc/contract"

import {
	CasePlaybookSchema,
	CaseRefInputSchema,
	CompletePlaybookStepInputSchema,
	PlaybookListInputSchema,
	PlaybookListOutputSchema,
	PlaybookMutationOutputSchema,
} from "./playbooks.schema.js"

export const playbooksContract = {
	list: oc
		.route({
			method: "GET",
			path: "/playbooks",
			summary: "List playbooks (optionally filter by case type)",
			tags: ["Playbooks"],
		})
		.input(PlaybookListInputSchema)
		.output(PlaybookListOutputSchema),

	getForCase: oc
		.route({
			method: "GET",
			path: "/playbooks/case/{caseRef}",
			summary: "Get the playbook + per-step progress for a case",
			tags: ["Playbooks"],
		})
		.input(CaseRefInputSchema)
		.output(CasePlaybookSchema),

	completeStep: oc
		.route({
			method: "POST",
			path: "/playbooks/case/{caseRef}/complete-step",
			summary: "Mark a playbook step complete (or undo)",
			tags: ["Playbooks"],
		})
		.input(CompletePlaybookStepInputSchema)
		.output(PlaybookMutationOutputSchema),
}
