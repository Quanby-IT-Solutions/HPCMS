"use client"

import Link from "next/link"
import { useState } from "react"

import type { ClaimStatus } from "@repo/contracts"

import { X } from "@/core/components/icons"
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
import {
	useAgingReportQuery,
	useClaimsKpisQuery,
} from "@/features/agent-claims/api/claims.hooks"

const STATUS_VARIANT: Record<
	ClaimStatus,
	"default" | "secondary" | "outline" | "destructive"
> = {
	draft: "outline",
	submitted: "secondary",
	under_review: "secondary",
	approved: "default",
	rejected: "destructive",
	appealed: "secondary",
	paid: "default",
}

function downloadCsv(rows: ReturnType<typeof useAgingReportQuery>["data"]) {
	if (!rows) return
	const header = "claimId,caseRef,patientName,payerName,ageDays,amount,status\n"
	const body = rows.rows
		.map(r =>
			[
				r.claimId,
				r.caseRef,
				JSON.stringify(r.patientName),
				JSON.stringify(r.payerName),
				r.ageDays,
				r.amount,
				r.status,
			].join(",")
		)
		.join("\n")
	const blob = new Blob([header + body], { type: "text/csv" })
	const url = URL.createObjectURL(blob)
	const a = document.createElement("a")
	a.href = url
	a.download = `claims-aging-${Date.now()}.csv`
	a.click()
	URL.revokeObjectURL(url)
}

type AgingBucket = "0-30" | "31-60" | "61-90" | "90+"

function bucketFor(ageDays: number): AgingBucket {
	if (ageDays <= 30) return "0-30"
	if (ageDays <= 60) return "31-60"
	if (ageDays <= 90) return "61-90"
	return "90+"
}

export function ClaimsAgingPage() {
	const kpisQ = useClaimsKpisQuery()
	const agingQ = useAgingReportQuery()
	const [activeBucket, setActiveBucket] = useState<AgingBucket | null>(null)

	const filteredRows = agingQ.data
		? activeBucket
			? agingQ.data.rows.filter(r => bucketFor(r.ageDays) === activeBucket)
			: agingQ.data.rows
		: []

	function handlePrint() {
		if (typeof window !== "undefined") window.print()
	}

	return (
		<div className="flex flex-col gap-4">
			<header>
				<h1 className="text-2xl font-bold">Claims dashboard</h1>
				<p className="text-muted-foreground text-sm">
					Status counts, outstanding amount, and aging report.
				</p>
			</header>

			<section>
				{kpisQ.isLoading || !kpisQ.data ? (
					<Skeleton className="h-20 w-full" />
				) : (
					<dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
						{[
							{ label: "Draft", value: kpisQ.data.totalDraft },
							{ label: "Submitted", value: kpisQ.data.totalSubmitted },
							{ label: "Under review", value: kpisQ.data.totalUnderReview },
							{ label: "Approved", value: kpisQ.data.totalApproved },
							{ label: "Rejected", value: kpisQ.data.totalRejected, tone: "danger" },
							{ label: "Paid", value: kpisQ.data.totalPaid },
							{
								label: "Outstanding",
								value: `₱${kpisQ.data.outstandingAmount.toLocaleString()}`,
							},
							{
								label: "SLA breaching",
								value: kpisQ.data.slaBreaching,
								tone: "warn",
							},
						].map(c => (
							<div
								key={c.label}
								className={`rounded-md border p-2.5 ${
									c.tone === "danger"
										? "border-destructive/40 bg-destructive/5"
										: c.tone === "warn"
											? "border-amber-500/40 bg-amber-500/5"
											: "bg-muted/40"
								}`}
							>
								<dt className="text-muted-foreground text-[10px] uppercase">{c.label}</dt>
								<dd className="text-foreground mt-0.5 text-lg font-semibold">{c.value}</dd>
							</div>
						))}
					</dl>
				)}
			</section>

			<section className="flex flex-col gap-3">
				<div className="flex items-center justify-between">
					<h2 className="text-sm font-semibold">Aging buckets</h2>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => downloadCsv(agingQ.data)}
							disabled={!agingQ.data}
						>
							Export CSV
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={handlePrint}
							disabled={!agingQ.data}
						>
							Print / PDF
						</Button>
					</div>
				</div>
				{agingQ.isLoading || !agingQ.data ? (
					<Skeleton className="h-12 w-full" />
				) : (
					<dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
						{agingQ.data.buckets.map(b => {
							const isActive = activeBucket === b.bucket
							return (
								<button
									key={b.bucket}
									type="button"
									onClick={() => setActiveBucket(isActive ? null : b.bucket)}
									className={`flex flex-col items-start rounded-md border p-2.5 text-left transition-colors ${
										isActive
											? "border-primary/50 bg-primary/10"
											: "bg-muted/40 hover:bg-muted/60"
									}`}
								>
									<dt className="text-muted-foreground text-[10px] uppercase">
										{b.bucket} days
									</dt>
									<dd className="text-foreground mt-0.5 text-lg font-semibold">
										{b.count}
									</dd>
									<dd className="text-muted-foreground text-[11px]">
										₱{b.totalAmount.toLocaleString()}
									</dd>
								</button>
							)
						})}
					</dl>
				)}
				{activeBucket ? (
					<div className="flex items-center gap-2 text-xs">
						<span className="text-muted-foreground">
							Filtered to <span className="font-mono font-semibold">{activeBucket}</span>{" "}
							days
						</span>
						<Button
							variant="ghost"
							size="xs"
							onClick={() => setActiveBucket(null)}
						>
							<X className="size-3" />
							Clear
						</Button>
					</div>
				) : null}
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-sm font-semibold">
					Outstanding claims
					{activeBucket ? (
						<span className="text-muted-foreground ml-2 text-xs font-normal">
							· {filteredRows.length} in {activeBucket}d
						</span>
					) : null}
				</h2>
				{agingQ.isLoading || !agingQ.data ? (
					<Skeleton className="h-32 w-full" />
				) : filteredRows.length === 0 ? (
					<p className="text-muted-foreground text-sm italic">
						No claims in this bucket.
					</p>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Claim</TableHead>
								<TableHead>Case</TableHead>
								<TableHead>Patient</TableHead>
								<TableHead>Payer</TableHead>
								<TableHead>Age</TableHead>
								<TableHead>Amount</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredRows.map(r => (
								<TableRow key={r.claimId}>
									<TableCell>
										<Link
											href={`/agent/claims/${r.claimId}`}
											className="text-primary font-mono text-xs hover:underline"
										>
											{r.claimId}
										</Link>
									</TableCell>
									<TableCell className="font-mono text-xs">{r.caseRef}</TableCell>
									<TableCell className="text-xs">{r.patientName}</TableCell>
									<TableCell className="text-xs">{r.payerName}</TableCell>
									<TableCell className="text-xs tabular-nums">
										{r.ageDays}d
									</TableCell>
									<TableCell className="text-xs tabular-nums">
										₱{r.amount.toLocaleString()}
									</TableCell>
									<TableCell>
										<Badge variant={STATUS_VARIANT[r.status]}>
											{r.status.replace(/_/g, " ")}
										</Badge>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</section>
		</div>
	)
}
