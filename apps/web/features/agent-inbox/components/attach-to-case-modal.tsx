"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/core/components/ui/dialog"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import { Textarea } from "@/core/components/ui/textarea"
import { useAttachToCaseMutation } from "@/features/agent-inbox/api/inbox.hooks"

const SUGGESTED = [
	{ caseRef: "LOA-2026-00128", caseType: "loa", patientName: "Maria Santos" },
	{ caseRef: "LOA-2026-00131", caseType: "loa", patientName: "Ramon Cruz" },
	{ caseRef: "FUP-2026-00098", caseType: "follow_up", patientName: "Anna Tan" },
]

export function AttachToCaseModal({ inboxItemId }: { inboxItemId: string }) {
	const [open, setOpen] = useState(false)
	const [filter, setFilter] = useState("")
	const [selected, setSelected] = useState<Set<string>>(new Set())
	const [note, setNote] = useState("")
	const { mutateAsync, isPending } = useAttachToCaseMutation()

	const filtered = SUGGESTED.filter(c =>
		`${c.caseRef} ${c.patientName} ${c.caseType}`
			.toLowerCase()
			.includes(filter.toLowerCase())
	)

	function toggle(caseRef: string) {
		setSelected(prev => {
			const next = new Set(prev)
			if (next.has(caseRef)) next.delete(caseRef)
			else next.add(caseRef)
			return next
		})
	}

	async function handleAttach() {
		if (selected.size === 0) return
		try {
			await mutateAsync({
				inboxItemId,
				caseRefs: Array.from(selected),
				note: note.trim() ? note.trim() : null,
			})
			toast.success(
				selected.size === 1
					? `Attached to ${Array.from(selected)[0]}`
					: `Attached to ${selected.size} cases`
			)
			setOpen(false)
			setSelected(new Set())
			setNote("")
			setFilter("")
		} catch (err) {
			toast.error("Could not attach", { description: (err as Error).message })
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={
					<Button type="button" variant="outline" size="sm">
						Attach to case
					</Button>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Attach to existing cases</DialogTitle>
					<DialogDescription>
						Search by case ID, patient name, or case type. Select one or more cases.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-3">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="attach-search">Search</Label>
						<Input
							id="attach-search"
							value={filter}
							onChange={e => setFilter(e.target.value)}
							placeholder="LOA-2026, Maria Santos, follow_up…"
						/>
					</div>
					<ul className="flex max-h-60 flex-col gap-1 overflow-y-auto">
						{filtered.length === 0 ? (
							<li className="text-muted-foreground p-2 text-xs italic">No matches.</li>
						) : (
							filtered.map(c => {
								const checked = selected.has(c.caseRef)
								return (
									<li key={c.caseRef}>
										<label
											className={`flex w-full cursor-pointer items-start gap-2 rounded-md border p-2 text-xs transition-colors ${
												checked
													? "border-primary/50 bg-primary/10"
													: "hover:bg-muted/50"
											}`}
										>
											<input
												type="checkbox"
												checked={checked}
												onChange={() => toggle(c.caseRef)}
												className="mt-0.5 size-3.5"
											/>
											<div className="flex-1">
												<div className="flex items-center justify-between gap-2">
													<span className="font-mono font-medium">{c.caseRef}</span>
													<span className="text-muted-foreground">{c.caseType}</span>
												</div>
												<div className="text-muted-foreground">{c.patientName}</div>
											</div>
										</label>
									</li>
								)
							})
						)}
					</ul>

					<div className="flex flex-col gap-1.5">
						<Label htmlFor="attach-note">Attachment note (optional)</Label>
						<Textarea
							id="attach-note"
							value={note}
							onChange={e => setNote(e.target.value)}
							rows={3}
							maxLength={500}
							placeholder="Why is this inquiry being linked here?"
						/>
						<span className="text-muted-foreground text-[10px]">
							{note.length}/500
						</span>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" size="sm" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button
						size="sm"
						onClick={handleAttach}
						disabled={selected.size === 0 || isPending}
					>
						{isPending
							? "Attaching…"
							: selected.size > 1
								? `Attach to ${selected.size} cases`
								: "Attach"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
