"use client"

import { useState } from "react"
import { toast } from "sonner"

import type { DrgRow } from "@repo/contracts"

import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Skeleton } from "@/core/components/ui/skeleton"
import {
	useClaimDrgQuery,
	useReorderDrgMutation,
	useUpsertDrgMutation,
} from "@/features/agent-claims/api/claims.hooks"

const LIMIT_DIAGNOSIS = 12
const LIMIT_PROCEDURE = 20

interface RowProps {
	rows: DrgRow[]
	kind: "diagnosis" | "procedure"
	limit: number
	onReorder: (orderedIds: string[]) => void
}

function DrgList({ rows, kind, limit, onReorder }: RowProps) {
	const [draggingId, setDraggingId] = useState<string | null>(null)
	const filled = rows.length / limit
	const tone =
		filled >= 1
			? "text-destructive"
			: filled >= 0.8
				? "text-amber-600 dark:text-amber-400"
				: "text-muted-foreground"

	function handleDragOver(e: React.DragEvent, overId: string) {
		e.preventDefault()
		if (!draggingId || draggingId === overId) return
		const fromIdx = rows.findIndex(r => r.id === draggingId)
		const toIdx = rows.findIndex(r => r.id === overId)
		if (fromIdx === -1 || toIdx === -1) return
		const next = [...rows]
		const [moved] = next.splice(fromIdx, 1)
		next.splice(toIdx, 0, moved!)
		onReorder(next.map(r => r.id))
	}

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold capitalize">{kind === "diagnosis" ? "Secondary diagnoses" : "Procedures"}</h3>
				<span className={`text-xs ${tone}`}>
					{rows.length}/{limit}
				</span>
			</div>
			<ol className="flex flex-col gap-1">
				{rows.length === 0 ? (
					<li className="text-muted-foreground rounded-md border border-dashed p-3 text-center text-xs italic">
						None added.
					</li>
				) : (
					rows.map(r => (
						<li
							key={r.id}
							draggable
							onDragStart={() => setDraggingId(r.id)}
							onDragOver={e => handleDragOver(e, r.id)}
							onDragEnd={() => setDraggingId(null)}
							className={`flex cursor-move items-center gap-2 rounded-md border p-2 text-xs ${
								draggingId === r.id ? "opacity-40" : ""
							}`}
						>
							<span className="text-muted-foreground w-5 tabular-nums">{r.rank}.</span>
							<span className="font-mono font-semibold">{r.code}</span>
							<span className="flex-1 truncate">{r.description}</span>
						</li>
					))
				)}
			</ol>
		</div>
	)
}

interface QuickAddProps {
	claimId: string
	kind: "diagnosis" | "procedure"
	nextRank: number
	disabled: boolean
}

function QuickAdd({ claimId, kind, nextRank, disabled }: QuickAddProps) {
	const [code, setCode] = useState("")
	const [desc, setDesc] = useState("")
	const upsert = useUpsertDrgMutation()

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (disabled) {
			toast.error(
				kind === "diagnosis"
					? "Maximum 12 secondary diagnoses reached"
					: "Maximum 20 procedures reached",
				{ description: "Remove an existing entry before adding a new one." }
			)
			return
		}
		if (code.trim().length === 0) return
		upsert.mutate(
			{
				id: null,
				claimId,
				kind,
				rank: nextRank,
				codeSystem: kind === "diagnosis" ? "icd10" : "phic_cpt",
				code: code.trim(),
				description: desc.trim() || code.trim(),
			},
			{
				onSuccess: () => {
					toast.success(`${kind === "diagnosis" ? "Diagnosis" : "Procedure"} added`)
					setCode("")
					setDesc("")
				},
			}
		)
	}

	return (
		<div className="flex flex-col gap-1">
			<form onSubmit={handleSubmit} className="flex gap-2">
				<Input
					value={code}
					onChange={e => setCode(e.target.value)}
					placeholder={kind === "diagnosis" ? "ICD-10 code" : "PHIC-CPT code"}
					className="flex-1"
					disabled={disabled}
				/>
				<Input
					value={desc}
					onChange={e => setDesc(e.target.value)}
					placeholder="Description"
					className="flex-[2]"
					disabled={disabled}
				/>
				<Button type="submit" size="sm" disabled={code.trim().length === 0}>
					Add
				</Button>
			</form>
			{disabled ? (
				<p className="text-destructive text-[10px]">
					{kind === "diagnosis"
						? "PhilHealth allows at most 12 secondary diagnoses per claim."
						: "PhilHealth allows at most 20 procedures per claim."}
				</p>
			) : null}
		</div>
	)
}

interface DrgPanelProps {
	claimId: string
}

export function DrgPanel({ claimId }: DrgPanelProps) {
	const { data, isLoading } = useClaimDrgQuery(claimId)
	const reorder = useReorderDrgMutation()

	if (isLoading || !data) {
		return <Skeleton className="h-32 w-full" />
	}

	const dxAtLimit = data.diagnoses.length >= LIMIT_DIAGNOSIS
	const pxAtLimit = data.procedures.length >= LIMIT_PROCEDURE

	return (
		<div className="flex flex-col gap-4 rounded-md border p-4">
			<h2 className="text-sm font-semibold">DRG coding</h2>
			<DrgList
				rows={data.diagnoses}
				kind="diagnosis"
				limit={LIMIT_DIAGNOSIS}
				onReorder={ids => reorder.mutate({ claimId, kind: "diagnosis", orderedIds: ids })}
			/>
			<QuickAdd
				claimId={claimId}
				kind="diagnosis"
				nextRank={data.diagnoses.length + 1}
				disabled={dxAtLimit}
			/>

			<div className="border-t pt-2">
				<DrgList
					rows={data.procedures}
					kind="procedure"
					limit={LIMIT_PROCEDURE}
					onReorder={ids => reorder.mutate({ claimId, kind: "procedure", orderedIds: ids })}
				/>
				<QuickAdd
					claimId={claimId}
					kind="procedure"
					nextRank={data.procedures.length + 1}
					disabled={pxAtLimit}
				/>
			</div>
		</div>
	)
}
