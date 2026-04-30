"use client"

import Link from "next/link"
import { toast } from "sonner"

import { SUPERVISOR_ROUTES } from "@/app/(staff)/supervisor/supervisor-routes"
import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import { useRelatedCasesQuery, useUnlinkRelatedCaseMutation } from "@/features/supervisor-cases/api/supervisor-related.hooks"
import { CaseSearchModal } from "@/features/supervisor-cases/components/case-search-modal"
import { RightRailPanel } from "@/features/supervisor-workspace/components/right-rail-panel"

const RELATIONSHIP_LABELS: Record<string, string> = {
	follow_up_from: "Follow-up",
	spawned_from: "Spawned from",
	duplicate_of: "Duplicate",
	part_of_incident: "Incident",
}

interface Props {
	caseRef: string
}

export function RelatedCasesPanel({ caseRef }: Props) {
	const { data, isLoading, refetch } = useRelatedCasesQuery(caseRef)
	const unlink = useUnlinkRelatedCaseMutation()

	async function handleUnlink(relatedRef: string) {
		try {
			await unlink.mutateAsync({ ref: caseRef, relatedCaseRef: relatedRef })
			toast.success("Unlinked")
			refetch()
		} catch (err) {
			toast.error("Unlink failed", { description: (err as Error).message })
		}
	}

	return (
		<RightRailPanel
			title="Related Cases"
			storageKey={`related-${caseRef}`}
			isLoading={isLoading}
			actions={<CaseSearchModal sourceCaseRef={caseRef} onLink={() => refetch()} />}
		>
			{(data?.links ?? []).length === 0 ? (
				<p className="text-muted-foreground text-xs">No related cases linked.</p>
			) : (
				<div className="flex flex-col gap-1.5">
					{data!.links.map(l => (
						<div key={l.caseRef} className="flex items-center justify-between text-xs">
							<div className="flex items-center gap-1.5 flex-wrap">
								<Link href={SUPERVISOR_ROUTES.caseDetail(l.caseRef)} className="font-mono hover:underline">
									{l.caseRef}
								</Link>
								<Badge variant="secondary" className="text-[10px] py-0 px-1">
									{RELATIONSHIP_LABELS[l.relationshipType] ?? l.relationshipType}
								</Badge>
								<span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 px-1.5 py-0 text-[10px] font-medium">
									{l.status.replace(/_/g, " ")}
								</span>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="h-5 px-1.5 text-[10px]"
								onClick={() => handleUnlink(l.caseRef)}
								disabled={unlink.isPending}
							>
								Unlink
							</Button>
						</div>
					))}
				</div>
			)}
		</RightRailPanel>
	)
}
