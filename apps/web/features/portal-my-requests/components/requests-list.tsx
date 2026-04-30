"use client"

import Link from "next/link"
import { FileText, PlusCircle, ShieldCheck } from "@/core/components/icons"

import { Badge } from "@/core/components/ui/badge"
import { buttonVariants } from "@/core/components/ui/button"
import { Card, CardContent } from "@/core/components/ui/card"
import { Skeleton } from "@/core/components/ui/skeleton"
import { cn } from "@/core/lib/utils"
import type { CaseStatus } from "@repo/contracts"

import { useMyRequestsQuery } from "../api/cases.hooks"

const STATUS_BADGE: Record<CaseStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
	submitted: { label: "Submitted", variant: "default" },
	in_review: { label: "In Review", variant: "secondary" },
	approved: { label: "Approved", variant: "default" },
	rejected: { label: "Rejected", variant: "destructive" },
	closed: { label: "Closed", variant: "outline" },
	withdrawn: { label: "Withdrawn", variant: "outline" },
}

interface RequestsListProps {
	hasLinkedPatient: boolean
}

export function RequestsList({ hasLinkedPatient }: RequestsListProps) {
	const { data, isLoading } = useMyRequestsQuery()

	if (isLoading) {
		return (
			<div className="flex flex-col gap-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<Skeleton key={i} className="h-20 w-full rounded-lg" />
				))}
			</div>
		)
	}

	if (!data?.items.length) {
		return (
			<Card>
				<CardContent className="flex flex-col items-center gap-4 py-12 text-center">
					<FileText className="text-muted-foreground size-10" />
					<div>
						<p className="font-medium">No requests yet</p>
						{hasLinkedPatient ? (
							<>
								<p className="text-muted-foreground mt-1 text-sm">
									Submit your first LOA request to get started.
								</p>
								<Link href="/portal/loa/new" className={cn(buttonVariants(), "mt-4 inline-flex")}>
									<PlusCircle className="mr-2 size-4" />
									Submit LOA
								</Link>
							</>
						) : (
							<>
								<p className="text-muted-foreground mt-1 text-sm">
									Verify your patient record before submitting a request.
								</p>
								<Link href="/portal/verify" className={cn(buttonVariants(), "mt-4 inline-flex")}>
									<ShieldCheck className="mr-2 size-4" />
									Verify Patient Record
								</Link>
							</>
						)}
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<div className="flex flex-col gap-3">
			{data.items.map(item => {
				const badge = STATUS_BADGE[item.status]
				return (
					<Link key={item.id} href={`/portal/requests/${item.caseRef}`}>
						<Card className="hover:bg-accent/50 cursor-pointer transition-colors">
							<CardContent className="flex items-center justify-between gap-4 py-4">
								<div className="min-w-0">
									<p className="font-medium">{item.caseRef}</p>
									<p className="text-muted-foreground text-sm capitalize">
										{item.caseType.replace(/_/g, " ")} · submitted{" "}
										{new Date(item.submittedAt).toLocaleDateString()}
									</p>
								</div>
								<div className="flex shrink-0 items-center gap-3">
									<p className="text-muted-foreground text-xs">
										Updated {new Date(item.updatedAt).toLocaleDateString()}
									</p>
									<Badge variant={badge.variant}>{badge.label}</Badge>
								</div>
							</CardContent>
						</Card>
					</Link>
				)
			})}
		</div>
	)
}
