"use client"

import { useState } from "react"

import { Badge } from "@/core/components/ui/badge"
import { Input } from "@/core/components/ui/input"
import { useTeamWorkloadQuery } from "@/features/supervisor-cases/api/supervisor-workload.hooks"

interface Props {
	teamId?: string
	onSelectAgent?: (agentId: string) => void
}

export function TeamWorkloadView({ teamId, onSelectAgent }: Props) {
	const { data } = useTeamWorkloadQuery({ teamId })
	const [filter, setFilter] = useState("")

	const agents = (data?.agents ?? []).filter(a =>
		!filter || a.name.toLowerCase().includes(filter.toLowerCase())
	)

	function saturationColor(s: number) {
		if (s >= 0.8) return "bg-red-500"
		if (s >= 0.6) return "bg-yellow-500"
		return "bg-green-500"
	}

	return (
		<div className="flex flex-col gap-2">
			<Input
				value={filter}
				onChange={e => setFilter(e.target.value)}
				placeholder="Filter agents…"
				className="h-7 text-xs"
			/>
			{agents.map(a => (
				<button
					key={a.userId}
					type="button"
					className="hover:bg-muted/40 flex w-full flex-col gap-1 rounded-md px-2 py-1.5 text-left"
					onClick={() => onSelectAgent?.(a.userId)}
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-1.5">
							<span className="text-xs font-medium">{a.name}</span>
							{a.isSuggested ? (
								<Badge variant="secondary" className="text-[10px] py-0 px-1">Suggested</Badge>
							) : null}
						</div>
						<span className="text-muted-foreground text-[10px]">{a.openCaseCount} open</span>
					</div>
					<div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
						<div
							className={`h-full rounded-full transition-all ${saturationColor(a.saturation)}`}
							style={{ width: `${Math.min(100, a.saturation * 100)}%` }}
						/>
					</div>
				</button>
			))}
		</div>
	)
}
