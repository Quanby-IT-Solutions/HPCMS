"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import type { InboxItem } from "@repo/contracts"

import { Button } from "@/core/components/ui/button"
import { Label } from "@/core/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select"
import { Textarea } from "@/core/components/ui/textarea"
import { orpc } from "@/services/orpc/client"

const CATEGORY_OPTIONS = [
	{ value: "loa_followup", label: "LOA follow-up" },
	{ value: "billing", label: "Billing" },
	{ value: "appointment", label: "Appointment" },
	{ value: "complaint", label: "Complaint" },
	{ value: "medication_query", label: "Medication query" },
	{ value: "other", label: "Other" },
]

export function AISuggestionPanel({ item }: { item: InboxItem }) {
	const [showOverride, setShowOverride] = useState(false)
	const [override, setOverride] = useState(item.aiSuggestion?.categoryKey ?? "other")
	const [reason, setReason] = useState("")
	const queryClient = useQueryClient()

	const accept = useMutation(
		orpc.inbox.suggestion.accept.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.inbox.list.key() }),
		})
	)
	const overrideMut = useMutation(
		orpc.inbox.suggestion.override.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.inbox.list.key() }),
		})
	)

	if (!item.aiSuggestion) return null

	const confidencePct = Math.round(item.aiSuggestion.confidence * 100)

	async function handleAccept() {
		try {
			await accept.mutateAsync({ inboxItemId: item.id })
			toast.success("AI suggestion accepted")
		} catch (err) {
			toast.error("Could not accept", { description: (err as Error).message })
		}
	}

	async function handleOverride() {
		if (reason.trim().length === 0) return
		try {
			await overrideMut.mutateAsync({
				inboxItemId: item.id,
				correctCategoryKey: override,
				reason: reason.trim(),
			})
			toast.success("Override saved")
			setShowOverride(false)
			setReason("")
		} catch (err) {
			toast.error("Could not save override", { description: (err as Error).message })
		}
	}

	return (
		<section className="bg-muted/30 flex flex-col gap-2 rounded-md border p-3">
			<div className="flex items-center justify-between gap-2">
				<div>
					<p className="text-[10px] uppercase tracking-wider text-muted-foreground">
						AI suggestion
					</p>
					<p className="text-sm font-medium">{item.aiSuggestion.categoryLabel}</p>
				</div>
				<div className="text-right">
					<p className="text-muted-foreground text-[10px]">Confidence</p>
					<p className="text-sm font-semibold tabular-nums">{confidencePct}%</p>
				</div>
			</div>
			<div className="bg-background h-1.5 w-full rounded-full">
				<div
					className="bg-primary h-1.5 rounded-full"
					style={{ width: `${confidencePct}%` }}
				/>
			</div>
			<dl className="grid grid-cols-2 gap-2 text-[11px]">
				<div className="bg-background rounded-md border p-2">
					<dt className="text-muted-foreground text-[10px] uppercase tracking-wider">
						Recommended case type
					</dt>
					<dd className="text-foreground font-medium">
						{item.aiSuggestion.suggestedCaseType ?? "—"}
					</dd>
				</div>
				<div className="bg-background rounded-md border p-2">
					<dt className="text-muted-foreground text-[10px] uppercase tracking-wider">
						Routing team
					</dt>
					<dd className="text-foreground font-medium">
						{item.aiSuggestion.routingTeam ?? "—"}
					</dd>
				</div>
			</dl>
			<div className="flex flex-wrap gap-2">
				<Button
					size="xs"
					onClick={handleAccept}
					disabled={accept.isPending}
				>
					Accept &amp; route
				</Button>
				<Button size="xs" variant="outline" onClick={() => setShowOverride(s => !s)}>
					{showOverride ? "Cancel" : "Override"}
				</Button>
			</div>
			{showOverride ? (
				<div className="flex flex-col gap-2 border-t pt-2">
					<div className="flex flex-col gap-1">
						<Label htmlFor="override-cat">Correct category</Label>
						<Select value={override} onValueChange={v => setOverride(v ?? "other")}>
							<SelectTrigger id="override-cat">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{CATEGORY_OPTIONS.map(o => (
									<SelectItem key={o.value} value={o.value}>
										{o.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col gap-1">
						<Label htmlFor="override-reason">Why was the AI wrong?</Label>
						<Textarea
							id="override-reason"
							rows={3}
							value={reason}
							onChange={e => setReason(e.target.value)}
							maxLength={500}
						/>
					</div>
					<Button
						size="xs"
						onClick={handleOverride}
						disabled={reason.trim().length === 0 || overrideMut.isPending}
					>
						{overrideMut.isPending ? "Saving…" : "Save override"}
					</Button>
				</div>
			) : null}
		</section>
	)
}
