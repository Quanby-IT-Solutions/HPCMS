"use client"

import Link from "next/link"

import { useClaimsListQuery } from "@/features/agent-claims/api/claims.hooks"
import { Skeleton } from "@/core/components/ui/skeleton"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/core/components/ui/table"

interface Props {
	caseRef: string
}

export function CaseClaimsTab({ caseRef }: Props) {
	const { data, isLoading } = useClaimsListQuery()
	const claims = data?.headers.filter(c => c.caseRef === caseRef) ?? []

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold">Claims for this case</h3>
				<Link
					href={`/agent/claims?createForCase=${caseRef}`}
					className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium"
				>
					Create claim
				</Link>
			</div>

			{isLoading ? (
				<Skeleton className="h-24 w-full" />
			) : claims.length === 0 ? (
				<p className="text-muted-foreground rounded-md border border-dashed p-4 text-center text-xs italic">
					No claims linked to this case yet.
				</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Claim</TableHead>
							<TableHead>Payer</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Total</TableHead>
							<TableHead />
						</TableRow>
					</TableHeader>
					<TableBody>
						{claims.map(c => (
							<TableRow key={c.id}>
								<TableCell className="font-mono text-xs">{c.id}</TableCell>
								<TableCell className="text-xs">{c.payerName}</TableCell>
								<TableCell className="text-xs uppercase">{c.claimType}</TableCell>
								<TableCell className="text-xs capitalize">
									{c.status.replace(/_/g, " ")}
								</TableCell>
								<TableCell className="text-xs tabular-nums">
									₱{c.totalAmount.toLocaleString()}
								</TableCell>
								<TableCell>
									<Link
										href={`/agent/claims/${c.id}`}
										className="text-primary text-xs font-medium hover:underline"
									>
										Open
									</Link>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	)
}
