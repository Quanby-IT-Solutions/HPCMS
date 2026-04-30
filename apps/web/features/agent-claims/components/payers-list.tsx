"use client"

import { useState } from "react"
import { toast } from "sonner"

import type { Payer } from "@repo/contracts"

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
import { Skeleton } from "@/core/components/ui/skeleton"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/core/components/ui/table"
import { usePayersListQuery } from "@/features/agent-claims/api/claims.hooks"

interface DraftPayer {
	id?: string
	name: string
	code: string
	contactEmail: string
}

const EMPTY_DRAFT: DraftPayer = { name: "", code: "", contactEmail: "" }

function PayerFormDialog({
	mode,
	initial,
	onSave,
	trigger,
}: {
	mode: "create" | "edit"
	initial?: Payer
	onSave: (draft: DraftPayer) => void
	trigger: React.ReactElement
}) {
	const [open, setOpen] = useState(false)
	const [draft, setDraft] = useState<DraftPayer>(
		initial
			? {
					id: initial.id,
					name: initial.name,
					code: initial.code ?? "",
					contactEmail: initial.contactEmail ?? "",
				}
			: EMPTY_DRAFT
	)

	function handleSave() {
		if (draft.name.trim().length === 0) return
		onSave({
			id: draft.id,
			name: draft.name.trim(),
			code: draft.code.trim(),
			contactEmail: draft.contactEmail.trim(),
		})
		setOpen(false)
		if (mode === "create") setDraft(EMPTY_DRAFT)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger render={trigger} />
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{mode === "create" ? "Add payer" : "Edit payer"}</DialogTitle>
					<DialogDescription>
						HMO or PhilHealth profile. Coverages are managed per patient.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-3">
					<div className="flex flex-col gap-1">
						<Label htmlFor="p-name">Name</Label>
						<Input
							id="p-name"
							value={draft.name}
							onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
						/>
					</div>
					<div className="flex flex-col gap-1">
						<Label htmlFor="p-code">Code</Label>
						<Input
							id="p-code"
							value={draft.code}
							onChange={e => setDraft(d => ({ ...d, code: e.target.value }))}
							placeholder="e.g. PHIC, MXC"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<Label htmlFor="p-email">Contact email</Label>
						<Input
							id="p-email"
							type="email"
							value={draft.contactEmail}
							onChange={e => setDraft(d => ({ ...d, contactEmail: e.target.value }))}
							placeholder="claims@payer.test"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" size="sm" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button size="sm" onClick={handleSave} disabled={draft.name.trim().length === 0}>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export function PayersList() {
	const { data, isLoading } = usePayersListQuery()
	// Local CRUD shadow until CA-BE-10 ships dedicated mutations.
	const [overlay, setOverlay] = useState<Payer[]>([])
	const [removed, setRemoved] = useState<Set<string>>(new Set())

	const merged = [
		...overlay,
		...(data?.payers ?? []).filter(p => !removed.has(p.id)),
	]

	function upsert(draft: DraftPayer) {
		if (draft.id) {
			setOverlay(prev => {
				const filtered = prev.filter(p => p.id !== draft.id)
				return [
					...filtered,
					{
						id: draft.id!,
						name: draft.name,
						code: draft.code || null,
						contactEmail: draft.contactEmail || null,
						createdAt: new Date(),
					},
				]
			})
			toast.success("Payer updated")
		} else {
			const id = `payer-${Date.now()}`
			setOverlay(prev => [
				...prev,
				{
					id,
					name: draft.name,
					code: draft.code || null,
					contactEmail: draft.contactEmail || null,
					createdAt: new Date(),
				},
			])
			toast.success("Payer added")
		}
	}

	function remove(id: string) {
		setRemoved(prev => new Set(prev).add(id))
		setOverlay(prev => prev.filter(p => p.id !== id))
		toast.success("Payer removed")
	}

	return (
		<div className="flex flex-col gap-3">
			<header className="flex items-start justify-between gap-2">
				<div>
					<h1 className="text-2xl font-bold">Payers</h1>
					<p className="text-muted-foreground text-sm">
						HMO and PhilHealth payer profiles. Coverages live per patient.
					</p>
				</div>
				<PayerFormDialog
					mode="create"
					onSave={upsert}
					trigger={
						<Button size="sm">Add payer</Button>
					}
				/>
			</header>
			{isLoading || !data ? (
				<Skeleton className="h-32 w-full" />
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Code</TableHead>
							<TableHead>Contact</TableHead>
							<TableHead>Created</TableHead>
							<TableHead />
						</TableRow>
					</TableHeader>
					<TableBody>
						{merged.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className="text-muted-foreground py-6 text-center">
									No payers configured.
								</TableCell>
							</TableRow>
						) : (
							merged.map(p => (
								<TableRow key={p.id}>
									<TableCell className="font-medium">{p.name}</TableCell>
									<TableCell className="font-mono text-xs">{p.code ?? "—"}</TableCell>
									<TableCell className="text-xs">{p.contactEmail ?? "—"}</TableCell>
									<TableCell className="text-muted-foreground text-xs">
										{new Date(p.createdAt).toLocaleDateString()}
									</TableCell>
									<TableCell>
										<div className="flex items-center justify-end gap-1">
											<PayerFormDialog
												mode="edit"
												initial={p}
												onSave={upsert}
												trigger={
													<Button variant="ghost" size="xs">
														Edit
													</Button>
												}
											/>
											<Button
												variant="ghost"
												size="xs"
												onClick={() => remove(p.id)}
											>
												Remove
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			)}
		</div>
	)
}
