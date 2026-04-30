"use client"

import * as React from "react"
import Link from "next/link"

import { Badge } from "@/core/components/ui/badge"
import { Button, buttonVariants } from "@/core/components/ui/button"
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/core/components/ui/sheet"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/core/components/ui/table"
import { useDataSegregationMatrixQuery } from "@/features/staff-admin/api/admin.hooks"
import { ADMIN_ROUTES } from "@/features/staff-admin/lib/admin-routes"

type SegregationLevel = "isolated" | "shared_policy" | "fully_shared"

interface SegregationCell {
	entityType: string
	tenantPair: string
	level: SegregationLevel
	policyRef: string | null
	justification: string | null
	lastReviewed: string | null
}

const ENTITY_TYPES = [
	"Patient",
	"Case",
	"Communication",
	"Claim",
	"Attachment",
	"Consent",
	"Audit Event",
]

const LEVEL_BADGE: Record<SegregationLevel, React.ReactNode> = {
	isolated: <Badge className="border-green-200 bg-green-100 text-green-700">Isolated</Badge>,
	shared_policy: (
		<Badge className="border-yellow-200 bg-yellow-100 text-yellow-700">Shared via Policy</Badge>
	),
	fully_shared: (
		<Badge className="border-blue-200 bg-blue-100 text-blue-700">Fully Shared</Badge>
	),
}

export function DataSegregationPage() {
	const { data, isLoading } = useDataSegregationMatrixQuery()
	const [selectedCell, setSelectedCell] = React.useState<SegregationCell | null>(null)
	const [printTimestamp, setPrintTimestamp] = React.useState<string | null>(null)

	function handleExportPdf() {
		setPrintTimestamp(new Date().toLocaleString())
		setTimeout(() => window.print(), 50)
	}

	const cells = data?.cells ?? []
	const summary = data?.summary ?? { isolated: 0, sharedPolicy: 0, fullyShared: 0 }
	const lastReviewed = data?.lastReviewed ?? null

	// Derive unique tenant pairs from cells
	const tenantPairs = Array.from(new Set(cells.map(c => c.tenantPair)))

	// Build a lookup: entityType+tenantPair → cell
	const cellMap = new Map<string, SegregationCell>()
	for (const cell of cells) {
		cellMap.set(`${cell.entityType}__${cell.tenantPair}`, cell as SegregationCell)
	}

	return (
		<div className="flex flex-col gap-6">
			{/* Print-only timestamp — hidden on screen, visible when printing */}
			{printTimestamp && (
				<div className="hidden print:block text-xs text-muted-foreground mb-2">
					Data Segregation Policy Matrix — Generated: {printTimestamp}
				</div>
			)}

			{/* Top banner */}
			<div className="bg-muted/50 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">
				<div className="flex flex-wrap gap-4 text-sm">
					<span>
						<strong>{summary.isolated}</strong> Isolated
					</span>
					<span className="text-muted-foreground">·</span>
					<span>
						<strong>{summary.sharedPolicy}</strong> Shared via Policy
					</span>
					<span className="text-muted-foreground">·</span>
					<span>
						<strong>{summary.fullyShared}</strong> Fully Shared
					</span>
					{lastReviewed && (
						<>
							<span className="text-muted-foreground">·</span>
							<span className="text-muted-foreground">
								Last reviewed:{" "}
								<span className="text-foreground font-medium">{lastReviewed}</span>
							</span>
						</>
					)}
				</div>
				<Button variant="outline" size="sm" onClick={handleExportPdf}>
					Export PDF
				</Button>
			</div>

			{/* Policy matrix table */}
			<div className="overflow-x-auto rounded-lg border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-36">Entity Type</TableHead>
							{tenantPairs.map(pair => (
								<TableHead key={pair}>{pair}</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell
									colSpan={1 + tenantPairs.length}
									className="text-muted-foreground py-10 text-center text-sm"
								>
									Loading…
								</TableCell>
							</TableRow>
						) : (
							ENTITY_TYPES.map(entityType => (
								<TableRow key={entityType}>
									<TableCell className="font-medium">{entityType}</TableCell>
									{tenantPairs.map(pair => {
										const cell = cellMap.get(`${entityType}__${pair}`)
										if (!cell) {
											return (
												<TableCell key={pair} className="text-muted-foreground text-center">
													—
												</TableCell>
											)
										}
										return (
											<TableCell key={pair}>
												<button
													type="button"
													onClick={() => setSelectedCell(cell)}
													className="cursor-pointer transition-opacity hover:opacity-80"
												>
													{LEVEL_BADGE[cell.level]}
												</button>
											</TableCell>
										)
									})}
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Side drawer for cell detail */}
			<Sheet open={!!selectedCell} onOpenChange={open => { if (!open) setSelectedCell(null) }}>
				<SheetContent side="right" className="w-80 sm:max-w-80">
					<SheetHeader>
						<SheetTitle>Segregation Detail</SheetTitle>
					</SheetHeader>

					{selectedCell && (
						<div className="flex flex-col gap-4 p-4">
							<div className="flex flex-col gap-1">
								<p className="text-muted-foreground text-xs uppercase tracking-wide">
									Entity Type
								</p>
								<p className="font-medium">{selectedCell.entityType}</p>
							</div>

							<div className="flex flex-col gap-1">
								<p className="text-muted-foreground text-xs uppercase tracking-wide">
									Tenant Pair
								</p>
								<p className="font-medium">{selectedCell.tenantPair}</p>
							</div>

							<div className="flex flex-col gap-1">
								<p className="text-muted-foreground text-xs uppercase tracking-wide">Level</p>
								{LEVEL_BADGE[selectedCell.level]}
							</div>

							{selectedCell.policyRef && (
								<div className="flex flex-col gap-1">
									<p className="text-muted-foreground text-xs uppercase tracking-wide">
										Policy Reference
									</p>
									<p className="font-mono text-sm">{selectedCell.policyRef}</p>
								</div>
							)}

							{selectedCell.justification && (
								<div className="flex flex-col gap-1">
									<p className="text-muted-foreground text-xs uppercase tracking-wide">
										Justification
									</p>
									<p className="text-sm">{selectedCell.justification}</p>
								</div>
							)}

							{selectedCell.lastReviewed && (
								<div className="flex flex-col gap-1">
									<p className="text-muted-foreground text-xs uppercase tracking-wide">
										Last Reviewed
									</p>
									<p className="text-sm">{selectedCell.lastReviewed}</p>
								</div>
							)}

							<div className="border-t pt-4">
								<Link
									href={`${ADMIN_ROUTES.tenants}?entity=${encodeURIComponent(selectedCell.entityType)}&tenantPair=${encodeURIComponent(selectedCell.tenantPair)}`}
									className={buttonVariants({ variant: "outline", size: "sm" }) + " w-full justify-center"}
								>
									Edit in Tenant Configuration →
								</Link>
							</div>

							<p className="text-muted-foreground text-xs">
								Edit in Shared Policies → (coming soon)
							</p>
						</div>
					)}
				</SheetContent>
			</Sheet>
		</div>
	)
}
