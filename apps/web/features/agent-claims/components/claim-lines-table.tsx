"use client"

import { useState } from "react"
import { toast } from "sonner"

import type { ClaimHeader, ClaimLine } from "@repo/contracts"

import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Skeleton } from "@/core/components/ui/skeleton"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/core/components/ui/table"
import { CodeLookupPopover } from "@/features/agent-claims/components/code-lookup-popover"
import {
	useClaimLinesQuery,
	useUpsertClaimLineMutation,
} from "@/features/agent-claims/api/claims.hooks"

interface Props {
	header: ClaimHeader
}

interface DraftLine {
	codeSystem: ClaimLine["codeSystem"]
	code: string
	description: string
	quantity: string
	billedAmount: string
	approvedAmount: string
}

const EMPTY_DRAFT: DraftLine = {
	codeSystem: "phic_cpt",
	code: "",
	description: "",
	quantity: "1",
	billedAmount: "0",
	approvedAmount: "",
}

export function ClaimLinesTable({ header }: Props) {
	const linesQ = useClaimLinesQuery(header.id)
	const upsert = useUpsertClaimLineMutation()
	const [draft, setDraft] = useState<DraftLine>(EMPTY_DRAFT)

	const lines = linesQ.data?.lines ?? []
	const linesTotal = lines.reduce((acc, l) => acc + l.billedAmount * l.quantity, 0)
	const mismatch = Math.abs(linesTotal - header.totalAmount) > 0.01

	function handleAddLine(e: React.FormEvent) {
		e.preventDefault()
		if (draft.code.trim().length === 0) return
		upsert.mutate(
			{
				id: null,
				claimId: header.id,
				codeSystem: draft.codeSystem,
				code: draft.code.trim(),
				description: draft.description.trim(),
				quantity: Number(draft.quantity) || 1,
				billedAmount: Number(draft.billedAmount) || 0,
				approvedAmount: draft.approvedAmount.trim()
					? Number(draft.approvedAmount)
					: null,
			},
			{
				onSuccess: () => {
					toast.success("Line added")
					setDraft(EMPTY_DRAFT)
				},
				onError: err =>
					toast.error("Could not add line", { description: (err as Error).message }),
			}
		)
	}

	return (
		<div className="flex flex-col gap-3 rounded-md border p-4">
			<div className="flex items-center justify-between">
				<h2 className="text-sm font-semibold">Line items</h2>
				<div
					className={`text-xs tabular-nums ${
						mismatch ? "text-destructive font-medium" : "text-muted-foreground"
					}`}
				>
					Lines total ₱{linesTotal.toFixed(2)} · header ₱{header.totalAmount.toFixed(2)}
					{mismatch ? " · MISMATCH" : ""}
				</div>
			</div>

			{linesQ.isLoading ? (
				<Skeleton className="h-24 w-full" />
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>#</TableHead>
							<TableHead>System</TableHead>
							<TableHead>Code</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Qty</TableHead>
							<TableHead>Billed</TableHead>
							<TableHead>Approved</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{lines.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} className="text-muted-foreground py-6 text-center">
									No line items.
								</TableCell>
							</TableRow>
						) : (
							lines.map(l => (
								<TableRow key={l.id}>
									<TableCell className="text-xs">{l.lineNumber}</TableCell>
									<TableCell className="text-xs uppercase">{l.codeSystem}</TableCell>
									<TableCell className="font-mono text-xs">{l.code}</TableCell>
									<TableCell className="text-xs">{l.description}</TableCell>
									<TableCell className="text-xs tabular-nums">{l.quantity}</TableCell>
									<TableCell className="text-xs tabular-nums">
										₱{l.billedAmount.toFixed(2)}
									</TableCell>
									<TableCell className="text-xs tabular-nums">
										{l.approvedAmount !== null ? `₱${l.approvedAmount.toFixed(2)}` : "—"}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			)}

			<form
				onSubmit={handleAddLine}
				className="bg-muted/30 grid items-end gap-2 rounded-md p-3 sm:grid-cols-7"
			>
				<div className="sm:col-span-1">
					<label className="text-muted-foreground text-[10px] uppercase">System</label>
					<select
						value={draft.codeSystem}
						onChange={e =>
							setDraft(d => ({ ...d, codeSystem: e.target.value as ClaimLine["codeSystem"] }))
						}
						className="border-input bg-background h-9 w-full rounded-md border px-2 text-xs"
					>
						<option value="phic_cpt">PHIC CPT</option>
						<option value="icd10">ICD-10</option>
						<option value="loinc">LOINC</option>
						<option value="ndc">NDC</option>
						<option value="internal">Internal</option>
					</select>
				</div>
				<div className="sm:col-span-1">
					<label className="text-muted-foreground text-[10px] uppercase">Code</label>
					<CodeLookupPopover
						system={draft.codeSystem}
						value={draft.code}
						onChange={(code, description) =>
							setDraft(d => ({ ...d, code, description }))
						}
					/>
				</div>
				<div className="sm:col-span-2">
					<label className="text-muted-foreground text-[10px] uppercase">Description</label>
					<Input
						value={draft.description}
						onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
					/>
				</div>
				<div>
					<label className="text-muted-foreground text-[10px] uppercase">Qty</label>
					<Input
						type="number"
						min={1}
						value={draft.quantity}
						onChange={e => setDraft(d => ({ ...d, quantity: e.target.value }))}
					/>
				</div>
				<div>
					<label className="text-muted-foreground text-[10px] uppercase">Billed</label>
					<Input
						type="number"
						min={0}
						value={draft.billedAmount}
						onChange={e => setDraft(d => ({ ...d, billedAmount: e.target.value }))}
					/>
				</div>
				<div>
					<label className="text-muted-foreground text-[10px] uppercase">
						Approved (opt.)
					</label>
					<div className="flex gap-1">
						<Input
							type="number"
							min={0}
							value={draft.approvedAmount}
							onChange={e =>
								setDraft(d => ({ ...d, approvedAmount: e.target.value }))
							}
							placeholder="—"
						/>
						<Button type="submit" size="sm" disabled={upsert.isPending}>
							Add
						</Button>
					</div>
				</div>
			</form>
		</div>
	)
}
