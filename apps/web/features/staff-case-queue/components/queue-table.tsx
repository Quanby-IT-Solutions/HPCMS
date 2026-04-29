"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

import type { CasePriority, CaseStatus } from "@repo/contracts"

import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import { Skeleton } from "@/core/components/ui/skeleton"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/core/components/ui/table"
import { useCasesListQuery, useClaimCaseMutation } from "../api/cases.hooks"

type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"

const STATUS_BADGE: Record<CaseStatus, BadgeVariant> = {
	submitted: "outline",
	in_review: "secondary",
	approved: "default",
	rejected: "destructive",
	closed: "secondary",
	withdrawn: "outline",
}

const PRIORITY_BADGE: Record<CasePriority, BadgeVariant> = {
	low: "outline",
	medium: "secondary",
	high: "default",
	urgent: "destructive",
}

interface QueueTableProps {
	selectedRef: string | null
	onSelectRef: (ref: string | null) => void
}

export function QueueTable({ selectedRef, onSelectRef }: QueueTableProps) {
	const searchParams = useSearchParams()
	const router = useRouter()

	const tab = (searchParams.get("tab") ?? "mine") as "mine" | "team" | "all_open"
	const status = (searchParams.get("status") as CaseStatus | null) ?? undefined
	const priority = (searchParams.get("priority") as CasePriority | null) ?? undefined
	const page = Number(searchParams.get("page") ?? "1")

	const { data, isLoading } = useCasesListQuery({
		tab,
		status,
		priority,
		page,
		sort: "oldest_first",
	})

	const { mutateAsync: claim } = useClaimCaseMutation()

	async function handleClaim(e: React.MouseEvent, ref: string) {
		e.stopPropagation()
		try {
			await claim({ ref })
			toast.success("Case claimed")
		} catch {
			toast.error("Failed to claim case")
		}
	}

	function setPage(p: number) {
		const params = new URLSearchParams(searchParams.toString())
		params.set("page", String(p))
		router.push(`?${params.toString()}`)
	}

	if (isLoading) {
		return (
			<div className="flex flex-col gap-2">
				{Array.from({ length: 5 }).map((_, i) => (
					<Skeleton key={i} className="h-12 w-full" />
				))}
			</div>
		)
	}

	const items = data?.items ?? []
	const total = data?.total ?? 0
	const limit = data?.limit ?? 20
	const totalPages = Math.max(1, Math.ceil(total / limit))

	return (
		<div className="flex flex-col gap-4">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Ref</TableHead>
						<TableHead>Type</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Priority</TableHead>
						<TableHead>Submitted</TableHead>
						<TableHead>Assigned</TableHead>
						<TableHead />
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.length === 0 ? (
						<TableRow>
							<TableCell colSpan={7} className="text-muted-foreground py-8 text-center">
								No cases found
							</TableCell>
						</TableRow>
					) : (
						items.map(c => (
							<TableRow
								key={c.id}
								className={`cursor-pointer ${selectedRef === c.caseRef ? "bg-muted" : ""}`}
								onClick={() => onSelectRef(selectedRef === c.caseRef ? null : c.caseRef)}
							>
								<TableCell className="font-mono text-xs">{c.caseRef}</TableCell>
								<TableCell>{c.caseType}</TableCell>
								<TableCell>
									<Badge variant={STATUS_BADGE[c.status]}>
										{c.status.replace(/_/g, " ")}
									</Badge>
								</TableCell>
								<TableCell>
									<Badge variant={PRIORITY_BADGE[c.priority]}>
										{c.priority}
									</Badge>
								</TableCell>
								<TableCell className="text-muted-foreground text-xs">
									{new Date(c.submittedAt).toLocaleDateString()}
								</TableCell>
								<TableCell className="text-xs">
									{c.assignedUserId ? c.assignedUserId.slice(0, 8) + "…" : "-"}
								</TableCell>
								<TableCell>
									{c.status === "submitted" && (
										<Button
											size="xs"
											variant="outline"
											onClick={e => handleClaim(e, c.caseRef)}
										>
											Claim
										</Button>
									)}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>

			{totalPages > 1 && (
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground text-sm">
						{total} total &middot; page {page} of {totalPages}
					</span>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							disabled={page <= 1}
							onClick={() => setPage(page - 1)}
						>
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							disabled={page >= totalPages}
							onClick={() => setPage(page + 1)}
						>
							Next
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}
