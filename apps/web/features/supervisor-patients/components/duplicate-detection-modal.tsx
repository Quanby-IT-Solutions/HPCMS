"use client"

import type { DuplicateCandidate } from "@repo/contracts"

import { Button } from "@/core/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/core/components/ui/dialog"

interface Props {
	open: boolean
	onOpenChange: (v: boolean) => void
	incoming: { fullName: string; dateOfBirth: string; phone?: string }
	candidates: DuplicateCandidate[]
	onUseExisting: (patientId: string) => void
	onMerge: (patientId: string) => void
	onCreateAnyway: () => void
}

export function DuplicateDetectionModal({
	open,
	onOpenChange,
	incoming,
	candidates,
	onUseExisting,
	onMerge,
	onCreateAnyway,
}: Props) {
	const top = candidates[0]

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Possible duplicate patient detected</DialogTitle>
				</DialogHeader>
				<div className="grid grid-cols-2 gap-4 text-sm">
					<div className="rounded-md border p-3">
						<p className="text-muted-foreground mb-2 text-[11px] font-medium uppercase tracking-wider">
							New record
						</p>
						<p className="font-semibold">{incoming.fullName}</p>
						<p className="text-muted-foreground">{incoming.dateOfBirth}</p>
						{incoming.phone ? <p className="text-muted-foreground">{incoming.phone}</p> : null}
					</div>
					{top ? (
						<div className="rounded-md border p-3">
							<p className="text-muted-foreground mb-2 text-[11px] font-medium uppercase tracking-wider">
								Existing record · match {Math.round(top.matchScore * 100)}%
							</p>
							<p className={`font-semibold ${top.fullName !== incoming.fullName ? "bg-yellow-100" : ""}`}>
								{top.fullName}
							</p>
							<p className={`text-muted-foreground ${top.dateOfBirth !== incoming.dateOfBirth ? "bg-yellow-100" : ""}`}>
								{top.dateOfBirth}
							</p>
							<p className="text-muted-foreground font-mono text-xs">{top.mrn}</p>
						</div>
					) : null}
				</div>
				<div className="flex flex-wrap gap-2 pt-2">
					{top ? (
						<>
							<Button variant="outline" size="sm" onClick={() => onUseExisting(top.patientId)}>
								Use existing record
							</Button>
							<Button variant="outline" size="sm" onClick={() => onMerge(top.patientId)}>
								Merge records
							</Button>
						</>
					) : null}
					<Button variant="ghost" size="sm" onClick={onCreateAnyway}>
						Create anyway
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
