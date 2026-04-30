"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { CasePlaybook, Playbook } from "@repo/contracts"

import { orpc } from "@/services/orpc/client"

const MOCK_PLAYBOOKS: Playbook[] = [
	{
		key: "loa-followup",
		name: "LOA follow-up coordination",
		caseType: "loa",
		description: "Standard playbook for following up on a stalled LOA request.",
		updatedAt: new Date("2026-04-01"),
		steps: [
			{
				stepNumber: 1,
				title: "Verify HMO has received the request",
				body: "Call HMO to confirm receipt; document confirmation number.",
				deepLink: "/agent/inbox/log-call",
			},
			{
				stepNumber: 2,
				title: "Collect missing supporting documents from clinician",
				body: "Use the clinician sidebar to flag the case for medical sign-off if needed.",
				deepLink: null,
			},
			{
				stepNumber: 3,
				title: "Send patient an update via portal chat",
				body: "Use the LOA follow-up template.",
				deepLink: null,
			},
			{
				stepNumber: 4,
				title: "Set follow-up reminder",
				body: "Schedule a 48-hour callback if HMO has not responded.",
				deepLink: null,
			},
		],
	},
	{
		key: "complaint-handling",
		name: "Patient complaint handling",
		caseType: "complaint",
		description: "Triage and de-escalate patient complaints.",
		updatedAt: new Date("2026-03-12"),
		steps: [
			{
				stepNumber: 1,
				title: "Acknowledge the complaint within 1 hour",
				body: null,
				deepLink: null,
			},
			{
				stepNumber: 2,
				title: "Escalate to supervisor if scope > department",
				body: null,
				deepLink: null,
			},
			{ stepNumber: 3, title: "Schedule a callback within 24h", body: null, deepLink: null },
		],
	},
]

function buildMockCasePlaybook(caseRef: string): CasePlaybook {
	return {
		caseRef,
		playbook: MOCK_PLAYBOOKS[0]!,
		progress: [
			{
				stepNumber: 1,
				completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
				completedByName: "J. Reyes",
			},
			{ stepNumber: 2, completedAt: null, completedByName: null },
			{ stepNumber: 3, completedAt: null, completedByName: null },
			{ stepNumber: 4, completedAt: null, completedByName: null },
		],
	}
}

export function usePlaybooksListQuery(caseType?: string) {
	return useQuery({
		...orpc.playbooks.list.queryOptions({ input: { caseType } }),
		staleTime: 60 * 1000,
		placeholderData: {
			playbooks: caseType ? MOCK_PLAYBOOKS.filter(p => p.caseType === caseType) : MOCK_PLAYBOOKS,
		},
	})
}

export function useCasePlaybookQuery(caseRef: string) {
	return useQuery({
		...orpc.playbooks.getForCase.queryOptions({ input: { caseRef } }),
		staleTime: 30 * 1000,
		placeholderData: buildMockCasePlaybook(caseRef),
	})
}

export function useCompletePlaybookStepMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.playbooks.completeStep.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.playbooks.getForCase.key() })
			},
		})
	)
}
