"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/core/components/ui/dialog"
import { Label } from "@/core/components/ui/label"
import { Textarea } from "@/core/components/ui/textarea"
import { orpc } from "@/services/orpc/client"

interface Props {
	caseRef: string
	currentRiskLevel: string
}

export function OverrideRiskModal({ caseRef, currentRiskLevel }: Props) {
	const [open, setOpen] = useState(false)
	const [justification, setJustification] = useState("")
	const queryClient = useQueryClient()

	const overrideMutation = useMutation({
		mutationFn: async (_data: { caseRef: string; justification: string }) => {
			await new Promise(r => setTimeout(r, 400))
			return { success: true }
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.cases.key() }),
	})

	async function handleSubmit() {
		if (justification.trim().length < 10) return
		await overrideMutation.mutateAsync({ caseRef, justification })
		toast.success("Risk level override recorded")
		setOpen(false)
		setJustification("")
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger render={<Button variant="outline" size="sm">Override Risk</Button>} />
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Override Risk Level — {caseRef}</DialogTitle>
				</DialogHeader>
				<p className="text-sm text-muted-foreground">
					Current risk: <strong>{currentRiskLevel}</strong>. Provide justification for overriding.
				</p>
				<div className="flex flex-col gap-1.5">
					<Label>Justification *</Label>
					<Textarea
						value={justification}
						onChange={e => setJustification(e.target.value)}
						rows={3}
						placeholder="Minimum 10 characters…"
						maxLength={500}
					/>
					<span className="text-muted-foreground text-[10px]">{justification.length}/500</span>
				</div>
				<DialogFooter>
					<Button variant="outline" size="sm" onClick={() => setOpen(false)} disabled={overrideMutation.isPending}>Cancel</Button>
					<Button size="sm" onClick={handleSubmit} disabled={justification.trim().length < 10 || overrideMutation.isPending}>
						{overrideMutation.isPending ? "Saving…" : "Override"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
