"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

import type { CasePriority, CaseStatus, RiskLevel } from "@repo/contracts"

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
import { useClaimCaseMutation } from "@/features/agent-case-queue/api/cases.hooks"
import { useQueueListQuery } from "@/features/agent-case-queue/api/queue.hooks"
import { QueueRowActions } from "@/features/agent-case-queue/components/queue-row-actions"
import { RiskBadge } from "@/features/agent-case-queue/components/risk-badge"
import { SlaTimerCell } from "@/features/agent-case-queue/components/sla-timer-cell"
import { OverrideRiskModal } from "@/features/supervisor-cases/components/override-risk-modal"

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

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

function formatAge(minutes: number): string {
	if (minutes < 60) return `${minutes}m`
	const hours = Math.floor(minutes / 60)
	if (hours < 24) return `${hours}h`
	const days = Math.floor(hours / 24)
	return `${days}d`
}

const RISK_RANK: Record<RiskLevel, number> = { critical: 4, high: 3, moderate: 2, low: 1 }

function clientSort<
	T extends {
		ageMinutes: number
		slaBreached: boolean
		priority: CasePriority
		updatedAt: Date | string
	},
>(items: T[], sort: string): T[] {
	const PRIORITY_RANK: Record<CasePriority, number> = {
		urgent: 4,
		high: 3,
		medium: 2,
		low: 1,
	}
	const sorted = [...items]
	switch (sort) {
		case "newest_first":
			return sorted.sort(
				(a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
			)
		case "priority_desc":
			return sorted.sort(
				(a, b) => PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority]
			)
		case "sla_breach":
			return sorted.sort(
				(a, b) =>
					Number(b.slaBreached) - Number(a.slaBreached) || b.ageMinutes - a.ageMinutes
			)
		case "risk_desc":
			return sorted.sort((a, b) => {
				const ra = RISK_RANK[(a as unknown as { riskLevel: RiskLevel }).riskLevel] ?? 0
				const rb = RISK_RANK[(b as unknown as { riskLevel: RiskLevel }).riskLevel] ?? 0
				return rb - ra
			})
		case "oldest_first":
		default:
			return sorted.sort((a, b) => b.ageMinutes - a.ageMinutes)
	}
}

interface QueueTableProps {
	selectedRef: string | null
	onSelectRef: (ref: string | null) => void
}

export function QueueTable({ selectedRef, onSelectRef }: QueueTableProps) {
	const searchParams = useSearchParams()
	const router = useRouter()

	const tab = (searchParams.get("tab") ?? "all_open") as "mine" | "team" | "all_open"
	const status = (searchParams.get("status") as CaseStatus | null) ?? undefined
	const priority = (searchParams.get("priority") as CasePriority | null) ?? undefined
	const riskLevel = (searchParams.get("risk") as RiskLevel | null) ?? undefined
	const slaBreaching = searchParams.get("slaBreaching") === "1" ? true : undefined
	const sortRaw = searchParams.get("sort") ?? "oldest_first"
	const apiSort: "oldest_first" | "newest_first" | "priority_desc" =
		sortRaw === "newest_first"
			? "newest_first"
			: sortRaw === "priority_desc"
				? "priority_desc"
				: "oldest_first"
	const page = Number(searchParams.get("page") ?? "1")

	const { data, isLoading } = useQueueListQuery({
		tab,
		status,
		priority,
		riskLevel,
		slaBreaching,
		page,
		sort: apiSort,
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

	const items = clientSort(data?.items ?? [], sortRaw)
	const total = data?.total ?? 0
	const pageSize = data?.pageSize ?? 25
	const totalPages = Math.max(1, Math.ceil(total / pageSize))

	return (
		<div className="flex flex-col gap-4">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Ref</TableHead>
						<TableHead>Patient</TableHead>
						<TableHead>Type</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Priority</TableHead>
						<TableHead>Risk</TableHead>
						<TableHead>Age</TableHead>
						<TableHead>SLA</TableHead>
						<TableHead>Assigned</TableHead>
						<TableHead />
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.length === 0 ? (
						<TableRow>
							<TableCell colSpan={10} className="text-muted-foreground py-8 text-center">
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
								<TableCell className="text-xs">
									<div className="font-medium">{c.patientName}</div>
									<div className="text-muted-foreground">{c.patientMrn}</div>
								</TableCell>
								<TableCell className="text-xs">{c.caseType}</TableCell>
								<TableCell>
									<Badge variant={STATUS_BADGE[c.status]}>
										{c.status.replace(/_/g, " ")}
									</Badge>
								</TableCell>
								<TableCell>
									<Badge variant={PRIORITY_BADGE[c.priority]}>{c.priority}</Badge>
								</TableCell>
								<TableCell>
									<RiskBadge level={c.riskLevel} />
								</TableCell>
								<TableCell className="text-xs tabular-nums">
									{formatAge(c.ageMinutes)}
								</TableCell>
								<TableCell>
									<SlaTimerCell dueAt={c.slaDueAt} breached={c.slaBreached} />
								</TableCell>
								<TableCell className="text-xs">
									{c.assigneeName ?? (
										<span className="text-muted-foreground">Unassigned</span>
									)}
								</TableCell>
								<TableCell>
									<div className="flex items-center justify-end gap-1">
										{c.status === "submitted" && (
											<Button
												size="xs"
												variant="outline"
												onClick={e => handleClaim(e, c.caseRef)}
											>
												Claim
											</Button>
										)}
										{c.riskLevel && <OverrideRiskModal caseRef={c.caseRef} currentRiskLevel={c.riskLevel} />}
										<QueueRowActions row={c} canReassign />
									</div>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>

			{totalPages > 1 && (
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground text-sm">
						{total} total · page {page} of {totalPages}
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
