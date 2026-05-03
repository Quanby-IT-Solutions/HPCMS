"use client"

import * as React from "react"

import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import { Card, CardContent } from "@/core/components/ui/card"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/core/components/ui/dialog"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import { Spinner } from "@/core/components/ui/spinner"
import { Switch } from "@/core/components/ui/switch"
import { Textarea } from "@/core/components/ui/textarea"
import {
	useCreateTriageCategoryMutation,
	useReorderTriageCategoriesMutation,
	useSimulateTriageMutation,
	useTriageCategoriesQuery,
	useUpdateTriageCategoryMutation,
} from "@/features/staff-admin/api/admin.hooks"

// ─── Types ────────────────────────────────────────────────────────────────────

interface TriageCategory {
	id: string
	name: string
	triggerKeywords: string[]
	negativeKeywords: string[]
	threshold: number
	routingRuleId: string | null
	status: "active" | "inactive"
	order: number
}

interface CategoryFormState {
	name: string
	triggerKeywords: string
	negativeKeywords: string
	threshold: number
	routingRuleId: string
}

function emptyFormState(): CategoryFormState {
	return {
		name: "",
		triggerKeywords: "",
		negativeKeywords: "",
		threshold: 0.7,
		routingRuleId: "",
	}
}

function categoryToFormState(cat: TriageCategory): CategoryFormState {
	return {
		name: cat.name,
		triggerKeywords: cat.triggerKeywords.join(", "),
		negativeKeywords: cat.negativeKeywords.join(", "),
		threshold: cat.threshold,
		routingRuleId: cat.routingRuleId ?? "",
	}
}

// ─── Category Form Dialog ─────────────────────────────────────────────────────

interface CategoryDialogProps {
	trigger: React.ReactNode
	title?: string
	initialState?: CategoryFormState
	onSave: (state: CategoryFormState) => void
	isSaving?: boolean
}

function CategoryDialog({
	trigger,
	title = "Add Category",
	initialState,
	onSave,
	isSaving,
}: CategoryDialogProps) {
	const [open, setOpen] = React.useState(false)
	const [form, setForm] = React.useState<CategoryFormState>(initialState ?? emptyFormState())

	React.useEffect(() => {
		if (open) {
			setForm(initialState ?? emptyFormState())
		}
	}, [open, initialState])

	function update(patch: Partial<CategoryFormState>) {
		setForm(prev => ({ ...prev, ...patch }))
	}

	function handleSave() {
		if (!form.name.trim()) return
		onSave(form)
		setOpen(false)
	}

	const triggerChips = form.triggerKeywords.split(",").map(s => s.trim()).filter(Boolean)
	const negativeChips = form.negativeKeywords.split(",").map(s => s.trim()).filter(Boolean)

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger render={<button type="button" className="contents" />}>{trigger}</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-4 py-2">
					<div className="flex flex-col gap-1.5">
						<Label>Name</Label>
						<Input
							value={form.name}
							onChange={e => update({ name: e.target.value })}
							placeholder="e.g., LOA Request"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label>Trigger Keywords (comma-separated)</Label>
						<Input
							value={form.triggerKeywords}
							onChange={e => update({ triggerKeywords: e.target.value })}
							placeholder="leave, absence, LOA"
						/>
						{triggerChips.length > 0 && (
							<div className="flex flex-wrap gap-1 mt-1">
								{triggerChips.map(kw => (
									<Badge key={kw} variant="secondary">{kw}</Badge>
								))}
							</div>
						)}
					</div>

					<div className="flex flex-col gap-1.5">
						<Label>Negative Keywords (comma-separated)</Label>
						<Input
							value={form.negativeKeywords}
							onChange={e => update({ negativeKeywords: e.target.value })}
							placeholder="e.g., refund, cancel"
						/>
						{negativeChips.length > 0 && (
							<div className="flex flex-wrap gap-1 mt-1">
								{negativeChips.map(kw => (
									<Badge key={kw} variant="outline">{kw}</Badge>
								))}
							</div>
						)}
					</div>

					<div className="flex flex-col gap-1.5">
						<Label>Threshold ({Math.round(form.threshold * 100)}%)</Label>
						<input
							type="range"
							min={0}
							max={1}
							step={0.05}
							value={form.threshold}
							onChange={e => update({ threshold: Number(e.target.value) })}
							className="w-full accent-primary"
						/>
						<div className="flex justify-between text-xs text-muted-foreground">
							<span>0%</span>
							<span>50%</span>
							<span>100%</span>
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label>Routing Rule ID (optional)</Label>
						<Input
							value={form.routingRuleId}
							onChange={e => update({ routingRuleId: e.target.value })}
							placeholder="rule-id"
						/>
					</div>
				</div>

				<DialogFooter>
					<Button onClick={handleSave} disabled={!form.name.trim() || isSaving}>
						{isSaving && <Spinner className="mr-1.5" />}
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

// ─── Categories Tab ───────────────────────────────────────────────────────────

function CategoriesTab() {
	const { data, isLoading } = useTriageCategoriesQuery()
	const createMutation = useCreateTriageCategoryMutation()
	const updateMutation = useUpdateTriageCategoryMutation()
	const reorderMutation = useReorderTriageCategoriesMutation()

	const categories: TriageCategory[] = (data?.categories ?? []).slice().sort((a, b) => a.order - b.order)

	function handleCreate(state: CategoryFormState) {
		createMutation.mutate({
			name: state.name,
			triggerKeywords: state.triggerKeywords.split(",").map(s => s.trim()).filter(Boolean),
			negativeKeywords: state.negativeKeywords.split(",").map(s => s.trim()).filter(Boolean),
			threshold: state.threshold,
			routingRuleId: state.routingRuleId || null,
			status: "active",
		})
	}

	function handleUpdate(id: string, state: CategoryFormState) {
		updateMutation.mutate({
			id,
			name: state.name,
			triggerKeywords: state.triggerKeywords.split(",").map(s => s.trim()).filter(Boolean),
			negativeKeywords: state.negativeKeywords.split(",").map(s => s.trim()).filter(Boolean),
			threshold: state.threshold,
			routingRuleId: state.routingRuleId || null,
			status: "active",
		})
	}

	function handleToggleStatus(cat: TriageCategory) {
		updateMutation.mutate({
			id: cat.id,
			name: cat.name,
			triggerKeywords: cat.triggerKeywords,
			negativeKeywords: cat.negativeKeywords,
			threshold: cat.threshold,
			routingRuleId: cat.routingRuleId,
			status: cat.status === "active" ? "inactive" : "active",
		})
	}

	function moveUp(index: number) {
		if (index === 0) return
		const newOrder = [...categories]
		const temp = newOrder[index - 1]!
		newOrder[index - 1] = newOrder[index]!
		newOrder[index] = temp
		reorderMutation.mutate({ orderedIds: newOrder.map(c => c.id) })
	}

	function moveDown(index: number) {
		if (index === categories.length - 1) return
		const newOrder = [...categories]
		const temp = newOrder[index + 1]!
		newOrder[index + 1] = newOrder[index]!
		newOrder[index] = temp
		reorderMutation.mutate({ orderedIds: newOrder.map(c => c.id) })
	}

	if (isLoading) {
		return <p className="text-muted-foreground text-sm">Loading categories…</p>
	}

	return (
		<div className="flex flex-col gap-3">
			<div className="flex justify-end">
				<CategoryDialog
					trigger={<Button size="sm">Add Category</Button>}
					onSave={handleCreate}
					isSaving={createMutation.isPending}
				/>
			</div>

			{categories.length === 0 && (
				<p className="text-muted-foreground text-sm">No triage categories configured.</p>
			)}

			<div className="flex flex-col gap-2">
				{categories.map((cat, index) => (
					<div key={cat.id} className="flex items-start gap-3 rounded-lg border p-3">
						{/* Order badge */}
						<Badge variant="outline" className="mt-0.5 shrink-0">
							#{cat.order}
						</Badge>

						{/* Content */}
						<div className="flex flex-1 flex-col gap-1 min-w-0">
							<div className="flex items-center gap-2">
								<span className="font-medium text-sm">{cat.name}</span>
								<Badge variant={cat.status === "active" ? "default" : "secondary"}>
									{cat.status}
								</Badge>
							</div>
							<p className="text-xs text-muted-foreground">
								{cat.triggerKeywords.length} keyword{cat.triggerKeywords.length !== 1 ? "s" : ""}
								{" · "}Threshold: {Math.round(cat.threshold * 100)}%
							</p>
						</div>

						{/* Controls */}
						<div className="flex items-center gap-2 shrink-0">
							{/* Reorder */}
							<div className="flex flex-col gap-0.5">
								<Button
									variant="ghost"
									size="icon-sm"
									disabled={index === 0 || reorderMutation.isPending}
									onClick={() => moveUp(index)}
									aria-label="Move up"
								>
									▲
								</Button>
								<Button
									variant="ghost"
									size="icon-sm"
									disabled={index === categories.length - 1 || reorderMutation.isPending}
									onClick={() => moveDown(index)}
									aria-label="Move down"
								>
									▼
								</Button>
							</div>

							{/* Toggle active */}
							<Switch
								checked={cat.status === "active"}
								onCheckedChange={() => handleToggleStatus(cat)}
								disabled={updateMutation.isPending}
								aria-label="Toggle category active"
							/>

							{/* Edit */}
							<CategoryDialog
								trigger={
									<Button variant="outline" size="sm">
										Edit
									</Button>
								}
								title="Edit Category"
								initialState={categoryToFormState(cat)}
								onSave={state => handleUpdate(cat.id, state)}
								isSaving={updateMutation.isPending}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

// ─── Test Simulator Tab ───────────────────────────────────────────────────────

function TestSimulatorTab() {
	const simulateMutation = useSimulateTriageMutation()
	const [message, setMessage] = React.useState("")

	function handleRunTest() {
		if (!message.trim()) return
		simulateMutation.mutate({ message })
	}

	const result = simulateMutation.data

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1.5">
				<Label>Patient Message</Label>
				<Textarea
					value={message}
					onChange={e => setMessage(e.target.value)}
					placeholder="Enter a patient message to test categorization..."
					rows={4}
				/>
			</div>

			<Button
				className="w-fit"
				onClick={handleRunTest}
				disabled={simulateMutation.isPending || !message.trim()}
			>
				{simulateMutation.isPending && <Spinner className="mr-1.5" />}
				Run Test
			</Button>

			{result && (
				<Card>
					<CardContent className="pt-4 flex flex-col gap-3">
						<div className="flex items-center gap-2">
							<span className="text-sm font-medium">Matched Category:</span>
							<span className="text-sm">
								{result.matchedCategoryName ?? "No match"}
							</span>
						</div>

						<div className="flex items-center gap-2">
							<span className="text-sm font-medium">Confidence:</span>
							<Badge variant={result.confidence >= 0.7 ? "default" : "secondary"}>
								{Math.round(result.confidence * 100)}%
							</Badge>
						</div>

						{result.highlightedKeywords.length > 0 && (
							<div className="flex flex-col gap-1.5">
								<span className="text-sm font-medium">Highlighted Keywords:</span>
								<div className="flex flex-wrap gap-1">
									{result.highlightedKeywords.map(kw => (
										<Badge key={kw} variant="secondary">{kw}</Badge>
									))}
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	)
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function AiTriagePage() {
	const [activeTab, setActiveTab] = React.useState<"categories" | "simulator">("categories")

	return (
		<div className="flex flex-col gap-4">
			{/* Tab bar */}
			<div className="flex gap-1 border-b">
				{(["categories", "simulator"] as const).map(tab => (
					<button
						key={tab}
						type="button"
						onClick={() => setActiveTab(tab)}
						className={[
							"px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
							activeTab === tab
								? "border-primary text-foreground"
								: "border-transparent text-muted-foreground hover:text-foreground",
						].join(" ")}
					>
						{tab === "categories" ? "Categories" : "Test Simulator"}
					</button>
				))}
			</div>

			{activeTab === "categories" && <CategoriesTab />}
			{activeTab === "simulator" && <TestSimulatorTab />}
		</div>
	)
}
