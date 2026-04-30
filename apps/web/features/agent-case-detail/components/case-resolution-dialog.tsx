"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import type { ResolveCategory } from "@repo/contracts"

import { X } from "@/core/components/icons"
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select"
import { Textarea } from "@/core/components/ui/textarea"
import { orpc } from "@/services/orpc/client"

const CATEGORIES: Array<{ value: ResolveCategory; label: string }> = [
	{ value: "resolved_patient_satisfied", label: "Resolved · Patient satisfied" },
	{ value: "escalated_to_clinician", label: "Escalated to clinician" },
	{ value: "closed_duplicate", label: "Closed · Duplicate" },
	{ value: "closed_no_action", label: "Closed · No action" },
]

const RELATED_COMM_OPTIONS = [
	{ id: "c-1", label: "Email · LOA follow-up · 30m ago" },
	{ id: "c-2", label: "Phone · Outbound to HMO · 6h ago" },
	{ id: "c-3", label: "Portal chat · Update sent · 1d ago" },
]

interface PendingAttachment {
	tempKey: string
	filename: string
	sizeBytes: number
}

interface Props {
	caseRef: string
	disabled?: boolean
}

export function CaseResolutionDialog({ caseRef, disabled }: Props) {
	const [open, setOpen] = useState(false)
	const [category, setCategory] = useState<ResolveCategory>("resolved_patient_satisfied")
	const [summary, setSummary] = useState("")
	const [notifyPatient, setNotifyPatient] = useState(true)
	const [attachments, setAttachments] = useState<PendingAttachment[]>([])
	const [linkedComms, setLinkedComms] = useState<string[]>([])
	const queryClient = useQueryClient()

	const { mutate, isPending } = useMutation(
		orpc.cases.resolve.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.cases.get.key() })
				queryClient.invalidateQueries({ queryKey: orpc.cases.list.key() })
				queryClient.invalidateQueries({ queryKey: orpc.cases.queue.list.key() })
			},
		})
	)

	function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
		const files = Array.from(e.target.files ?? [])
		const next: PendingAttachment[] = files.map((f, i) => ({
			tempKey: `pending-${Date.now()}-${i}-${f.name}`,
			filename: f.name,
			sizeBytes: f.size,
		}))
		setAttachments(prev => [...prev, ...next])
		// Reset the input so re-selecting the same file works.
		e.target.value = ""
	}

	function removeAttachment(tempKey: string) {
		setAttachments(prev => prev.filter(a => a.tempKey !== tempKey))
	}

	function toggleLinkedComm(id: string) {
		setLinkedComms(prev =>
			prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
		)
	}

	function handleSave() {
		if (summary.trim().length === 0) return
		mutate(
			{
				ref: caseRef,
				category,
				summary: summary.trim(),
				notifyPatient,
				attachmentKeys: attachments.map(a => a.tempKey),
			},
			{
				onSuccess: () => {
					toast.success("Case resolved", {
						description:
							linkedComms.length > 0
								? `Linked ${linkedComms.length} communication${
										linkedComms.length === 1 ? "" : "s"
									}`
								: undefined,
					})
					setOpen(false)
					setSummary("")
					setAttachments([])
					setLinkedComms([])
				},
				onError: err => {
					toast.error("Could not resolve case", { description: (err as Error).message })
				},
			}
		)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={
					<Button type="button" size="sm" disabled={disabled}>
						Resolve case
					</Button>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Resolve {caseRef}</DialogTitle>
					<DialogDescription>
						Select a resolution category and write a summary visible on the case timeline.
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-3">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="resolve-category">Category</Label>
						<Select
							value={category}
							onValueChange={v => v && setCategory(v as ResolveCategory)}
						>
							<SelectTrigger id="resolve-category">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{CATEGORIES.map(c => (
									<SelectItem key={c.value} value={c.value}>
										{c.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="resolve-summary">Summary</Label>
						<Textarea
							id="resolve-summary"
							value={summary}
							onChange={e => setSummary(e.target.value)}
							rows={4}
							maxLength={2000}
							placeholder="What was done to resolve this case?"
						/>
						<span className="text-muted-foreground text-[10px]">{summary.length}/2000</span>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label htmlFor="resolve-attachments">Attachments</Label>
						<Input
							id="resolve-attachments"
							type="file"
							multiple
							onChange={handleFiles}
							className="cursor-pointer"
						/>
						{attachments.length > 0 ? (
							<ul className="flex flex-col gap-1">
								{attachments.map(a => (
									<li
										key={a.tempKey}
										className="bg-muted/40 flex items-center justify-between gap-2 rounded-md px-2 py-1 text-xs"
									>
										<span className="truncate">
											{a.filename}{" "}
											<span className="text-muted-foreground">
												· {Math.round(a.sizeBytes / 1024)} KB
											</span>
										</span>
										<Button
											type="button"
											variant="ghost"
											size="icon-xs"
											onClick={() => removeAttachment(a.tempKey)}
											aria-label={`Remove ${a.filename}`}
										>
											<X className="size-3" />
										</Button>
									</li>
								))}
							</ul>
						) : null}
						<span className="text-muted-foreground text-[10px]">
							Files upload to secure storage on submit (uses existing presigned-upload
							flow once CA-BE-04 wires it).
						</span>
					</div>

					<label className="flex cursor-pointer items-center gap-2 text-sm">
						<input
							type="checkbox"
							checked={notifyPatient}
							onChange={e => setNotifyPatient(e.target.checked)}
							className="size-4"
						/>
						<span>
							Notify patient via portal notification when case is resolved
						</span>
					</label>

					<div className="flex flex-col gap-1.5">
						<Label>Link to related communications</Label>
						<ul className="flex flex-col gap-1">
							{RELATED_COMM_OPTIONS.map(opt => {
								const checked = linkedComms.includes(opt.id)
								return (
									<li key={opt.id}>
										<label className="hover:bg-muted/40 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-xs">
											<input
												type="checkbox"
												checked={checked}
												onChange={() => toggleLinkedComm(opt.id)}
												className="size-3.5"
											/>
											<span>{opt.label}</span>
										</label>
									</li>
								)
							})}
						</ul>
					</div>
				</div>

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => setOpen(false)}
						disabled={isPending}
					>
						Cancel
					</Button>
					<Button
						type="button"
						size="sm"
						onClick={handleSave}
						disabled={summary.trim().length === 0 || isPending}
					>
						{isPending ? "Resolving…" : "Resolve case"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
