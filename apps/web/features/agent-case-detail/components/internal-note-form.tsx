"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import { Textarea } from "@/core/components/ui/textarea"
import { useAddEventMutation } from "../api/cases.hooks"

interface InternalNoteFormProps {
	caseRef: string
}

export function InternalNoteForm({ caseRef }: InternalNoteFormProps) {
	const [note, setNote] = useState("")
	const { mutateAsync: addEvent, isPending } = useAddEventMutation()

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (!note.trim()) return
		try {
			await addEvent({
				ref: caseRef,
				eventType: "note_added",
				payload: { text: note.trim() },
				visibility: "internal",
			})
			toast.success("Note added")
			setNote("")
		} catch {
			toast.error("Failed to add note")
		}
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-2">
			<Textarea
				placeholder="Add internal note…"
				value={note}
				onChange={e => setNote(e.target.value)}
				className="min-h-20"
			/>
			<Button type="submit" size="sm" disabled={!note.trim() || isPending}>
				{isPending ? "Saving…" : "Add Note"}
			</Button>
		</form>
	)
}
