"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select"
import { useKbCategoryListQuery, useKbDeleteCategoryMutation, useKbUpsertCategoryMutation } from "@/features/supervisor-kb/api/supervisor-kb.hooks"

export function CategoriesManager() {
	const { data: categories, isLoading, refetch } = useKbCategoryListQuery()
	const upsert = useKbUpsertCategoryMutation()
	const deleteCategory = useKbDeleteCategoryMutation()

	const [name, setName] = useState("")
	const [parentId, setParentId] = useState("")
	const [showForm, setShowForm] = useState(false)
	const [editingId, setEditingId] = useState<string | null>(null)
	const [editName, setEditName] = useState("")

	async function handleAdd() {
		if (!name.trim()) return
		try {
			await upsert.mutateAsync({ name: name.trim(), parentId: parentId || undefined })
			toast.success("Category saved")
			setName("")
			setParentId("")
			setShowForm(false)
			refetch()
		} catch (err) {
			toast.error("Failed", { description: (err as Error).message })
		}
	}

	return (
		<div className="flex flex-col gap-4 max-w-xl">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">KB Categories</h1>
				<Button size="sm" onClick={() => setShowForm(v => !v)}>Add Category</Button>
			</div>

			{showForm ? (
				<div className="rounded-md border p-4 flex flex-col gap-3">
					<div className="flex flex-col gap-1.5">
						<Label>Category name</Label>
						<Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. LOA" />
					</div>
					<div className="flex flex-col gap-1.5">
						<Label>Parent category (optional)</Label>
						<Select value={parentId} onValueChange={v => setParentId(v ?? "")}>
							<SelectTrigger><SelectValue /></SelectTrigger>
							<SelectContent>
								<SelectItem value="">None</SelectItem>
								{(categories ?? []).map(c => (
									<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex gap-2">
						<Button onClick={handleAdd} disabled={!name.trim() || upsert.isPending}>
							{upsert.isPending ? "Saving…" : "Save"}
						</Button>
						<Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
					</div>
				</div>
			) : null}

			{isLoading ? <p className="text-muted-foreground text-sm">Loading…</p> : (
				<div className="rounded-md border divide-y">
					{(categories ?? []).map(c => (
						<div key={c.id} className="flex items-center justify-between px-4 py-3">
							{editingId === c.id ? (
								<div className="flex items-center gap-2 flex-1">
									<Input
										value={editName}
										onChange={e => setEditName(e.target.value)}
										className="h-7 text-sm max-w-48"
									/>
									<Button
										size="sm"
										className="h-7 text-xs"
										onClick={async () => {
											try {
												await upsert.mutateAsync({ id: c.id, name: editName.trim(), parentId: c.parentId ?? undefined })
												toast.success("Category updated")
												setEditingId(null)
												setEditName("")
												refetch()
											} catch (err) {
												toast.error("Failed", { description: (err as Error).message })
											}
										}}
										disabled={!editName.trim() || upsert.isPending}
									>
										{upsert.isPending ? "Saving…" : "Save"}
									</Button>
									<Button
										size="sm"
										variant="outline"
										className="h-7 text-xs"
										onClick={() => { setEditingId(null); setEditName("") }}
									>
										Cancel
									</Button>
								</div>
							) : (
								<div>
									<p className="font-medium text-sm">{c.name}</p>
									{c.parentId ? (
										<p className="text-muted-foreground text-xs">Parent: {(categories ?? []).find(x => x.id === c.parentId)?.name ?? c.parentId}</p>
									) : null}
								</div>
							)}
							{editingId !== c.id && (
								<div className="flex items-center gap-2">
									<span className="text-muted-foreground text-xs">{c.articleCount} articles</span>
									<Button
										size="sm"
										variant="ghost"
										className="h-6 text-xs"
										onClick={() => { setEditingId(c.id); setEditName(c.name) }}
									>
										Edit
									</Button>
									<Button
										size="sm"
										variant="ghost"
										className="h-6 text-xs text-destructive hover:text-destructive"
										disabled={deleteCategory.isPending}
										onClick={async () => {
											try {
												await deleteCategory.mutateAsync({ id: c.id })
												toast.success("Category deleted")
											} catch (err) {
												toast.error("Failed", { description: (err as Error).message })
											}
										}}
									>
										Delete
									</Button>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	)
}
