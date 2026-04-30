"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import { Textarea } from "@/core/components/ui/textarea"
import { useAddClinicalNoteMutation } from "@/features/clinician-sidebar/api/sidebar.hooks"

const MAX = 500

export function AddNoteForm({ caseRef, onClose }: { caseRef: string; onClose?: () => void }) {
	const [body, setBody] = useState("")
	const { mutate, isPending } = useAddClinicalNoteMutation()

	const tooLong = body.length > MAX
	const empty = body.trim().length === 0

	function handleSave() {
		if (empty || tooLong) return
		mutate(
			{ caseRef, body: body.trim() },
			{
				onSuccess: () => {
					toast.success("Note saved")
					setBody("")
					onClose?.()
				},
				onError: err => {
					toast.error("Could not save note", { description: (err as Error).message })
				},
			}
		)
	}

	return (
		<div className="flex flex-col gap-2">
			<Textarea
				value={body}
				onChange={e => setBody(e.target.value)}
				placeholder="Brief clinical note for the assigned case agent…"
				rows={3}
				aria-invalid={tooLong}
				aria-label="Clinical note"
				disabled={isPending}
				className="text-xs"
			/>
			<div className="flex items-center justify-between gap-2">
				<span
					className={tooLong ? "text-destructive text-[10px]" : "text-muted-foreground text-[10px]"}
				>
					{body.length}/{MAX}
				</span>
				<div className="flex items-center gap-1">
					{onClose ? (
						<Button
							type="button"
							variant="ghost"
							size="xs"
							onClick={onClose}
							disabled={isPending}
						>
							Cancel
						</Button>
					) : null}
					<Button
						type="button"
						size="xs"
						onClick={handleSave}
						disabled={empty || tooLong || isPending}
					>
						{isPending ? "Saving…" : "Save note"}
					</Button>
				</div>
			</div>
		</div>
	)
}
