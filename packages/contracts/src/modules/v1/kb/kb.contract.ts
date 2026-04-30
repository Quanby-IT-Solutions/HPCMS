import { oc } from "@orpc/contract"

import {
	KbArticleSchema,
	KbGetArticleInputSchema,
	KbSearchInputSchema,
	KbSearchOutputSchema,
	KbVoteFeedbackInputSchema,
	KbVoteFeedbackOutputSchema,
} from "./kb.schema.js"

export const kbContract = {
	search: oc
		.route({
			method: "GET",
			path: "/kb/search",
			summary: "Patient knowledge base search with featured categories + popular",
			tags: ["KnowledgeBase"],
		})
		.input(KbSearchInputSchema)
		.output(KbSearchOutputSchema),

	getArticle: oc
		.route({
			method: "GET",
			path: "/kb/articles/{slug}",
			summary: "Get KB article by slug",
			tags: ["KnowledgeBase"],
		})
		.input(KbGetArticleInputSchema)
		.output(KbArticleSchema),

	voteFeedback: oc
		.route({
			method: "POST",
			path: "/kb/articles/{slug}/feedback",
			summary: "Record helpful / not-helpful feedback on an article",
			tags: ["KnowledgeBase"],
		})
		.input(KbVoteFeedbackInputSchema)
		.output(KbVoteFeedbackOutputSchema),
}
