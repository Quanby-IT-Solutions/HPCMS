"use client"

import { useQuery } from "@tanstack/react-query"

import type { AgentWorkload } from "@repo/contracts"

import { orpc } from "@/services/orpc/client"

export function useTeamWorkloadQuery(params: { teamId?: string } = {}) {
	return useQuery({
		...orpc.supervisor.workload.teamWorkload.queryOptions({ input: params }),
		placeholderData: () => ({
			agents: [
				{ userId: "u-1", name: "J. Reyes", role: "case_agent", openCaseCount: 8, saturation: 0.8, isSuggested: false },
				{ userId: "u-2", name: "A. Santos", role: "case_agent", openCaseCount: 3, saturation: 0.3, isSuggested: true },
				{ userId: "u-3", name: "M. Cruz", role: "case_agent", openCaseCount: 6, saturation: 0.6, isSuggested: false },
				{ userId: "u-4", name: "R. Lopez", role: "case_agent", openCaseCount: 9, saturation: 0.9, isSuggested: false },
				{ userId: "u-5", name: "C. Flores", role: "case_agent", openCaseCount: 4, saturation: 0.4, isSuggested: false },
			] as AgentWorkload[],
		}),
	})
}
