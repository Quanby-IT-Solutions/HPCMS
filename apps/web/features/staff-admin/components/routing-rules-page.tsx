"use client"

import * as React from "react"

import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/core/components/ui/dialog"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import { Spinner } from "@/core/components/ui/spinner"
import { Switch } from "@/core/components/ui/switch"
import {
	useCreateRoutingRuleMutation,
	useReorderRoutingRulesMutation,
	useRoutingLogQuery,
	useRoutingRulesQuery,
	useToggleRoutingRuleMutation,
	useUpdateRoutingRuleMutation,
} from "@/features/staff-admin/api/admin.hooks"

import { AdminDataTable } from "./admin-data-table"
import {
	RuleBuilder,
	type Condition,
	type ConditionField,
	type ConditionOperator,
	type Rule,
	type RuleAction,
	type ActionType,
} from "./rule-builder"

// ─── Types ────────────────────────────────────────────────────────────────────

interface RoutingRule {
	id: string
	name: string
	order: number
	conditions: Condition[]
	action: RuleAction
	active: boolean
}

// ─── Empty Rule ───────────────────────────────────────────────────────────────

function emptyRule(): Rule {
	return {
		conditions: [],
		action: { type: "assign_team" as ActionType, value: "" },
	}
}

// ─── Rule Condition Summary ───────────────────────────────────────────────────

function conditionSummary(conditions: Condition[]): string {
	if (conditions.length === 0) return "No conditions"
	return conditions
		.map(c => `${c.field} ${c.operator} "${c.value}"`)
		.join(" AND ")
}

// ─── Add/Edit Rule Dialog ─────────────────────────────────────────────────────

interface RuleDialogProps {
	trigger: React.ReactNode
	initialName?: string
	initialRule?: Rule
	onSave: (name: string, rule: Rule) => void
	isSaving?: boolean
	title?: string
}

function RuleDialog({
	trigger,
	initialName = "",
	initialRule,
	onSave,
	isSaving,
	title = "Add Rule",
}: RuleDialogProps) {
	const [open, setOpen] = React.useState(false)
	const [name, setName] = React.useState(initialName)
	const [rule, setRule] = React.useState<Rule>(initialRule ?? emptyRule())

	React.useEffect(() => {
		if (open) {
			setName(initialName)
			setRule(initialRule ?? emptyRule())
		}
	}, [open, initialName, initialRule])

	function handleSave() {
		if (!name.trim()) return
		onSave(name.trim(), rule)
		setOpen(false)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger render={<button type="button" className="contents" />}>{trigger}</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-4 py-2">
					<div className="flex flex-col gap-1.5">
						<Label>Rule Name</Label>
						<Input
							value={name}
							onChange={e => setName(e.target.value)}
							placeholder="e.g., LOA Request Routing"
						/>
					</div>
					<RuleBuilder value={rule} onChange={setRule} />
				</div>

				<DialogFooter>
					<Button onClick={handleSave} disabled={!name.trim() || isSaving}>
						{isSaving && <Spinner className="mr-1.5" />}
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

// ─── Rules Tab ────────────────────────────────────────────────────────────────

function RulesTab() {
	const { data, isLoading } = useRoutingRulesQuery()
	const createMutation = useCreateRoutingRuleMutation()
	const updateMutation = useUpdateRoutingRuleMutation()
	const toggleMutation = useToggleRoutingRuleMutation()
	const reorderMutation = useReorderRoutingRulesMutation()

	const rules: RoutingRule[] = (data?.rules ?? []).slice().sort((a, b) => a.order - b.order)

	function handleCreate(name: string, rule: Rule) {
		createMutation.mutate({ name, conditions: rule.conditions, action: rule.action, active: true })
	}

	function handleUpdate(id: string, name: string, rule: Rule) {
		updateMutation.mutate({ id, name, conditions: rule.conditions, action: rule.action, active: true })
	}

	function handleToggle(id: string) {
		toggleMutation.mutate({ id })
	}

	function moveUp(index: number) {
		if (index === 0) return
		const newOrder = [...rules]
		const temp = newOrder[index - 1]!
		newOrder[index - 1] = newOrder[index]!
		newOrder[index] = temp
		reorderMutation.mutate({ orderedIds: newOrder.map(r => r.id) })
	}

	function moveDown(index: number) {
		if (index === rules.length - 1) return
		const newOrder = [...rules]
		const temp = newOrder[index + 1]!
		newOrder[index + 1] = newOrder[index]!
		newOrder[index] = temp
		reorderMutation.mutate({ orderedIds: newOrder.map(r => r.id) })
	}

	if (isLoading) {
		return <p className="text-muted-foreground text-sm">Loading rules…</p>
	}

	return (
		<div className="flex flex-col gap-3">
			<div className="flex justify-end">
				<RuleDialog
					trigger={<Button size="sm">Add Rule</Button>}
					onSave={handleCreate}
					isSaving={createMutation.isPending}
				/>
			</div>

			{rules.length === 0 && (
				<p className="text-muted-foreground text-sm">No routing rules configured.</p>
			)}

			<div className="flex flex-col gap-2">
				{rules.map((rule, index) => (
					<div key={rule.id} className="flex items-start gap-3 rounded-lg border p-3">
						{/* Priority badge */}
						<Badge variant="outline" className="mt-0.5 shrink-0">
							#{rule.order}
						</Badge>

						{/* Content */}
						<div className="flex flex-1 flex-col gap-1 min-w-0">
							<div className="flex items-center gap-2">
								<span className="font-medium text-sm">{rule.name}</span>
								<Badge variant={rule.active ? "default" : "secondary"}>
									{rule.active ? "Active" : "Inactive"}
								</Badge>
							</div>
							<p className="text-muted-foreground text-xs truncate">
								{conditionSummary(rule.conditions)}
							</p>
							<p className="text-xs">
								<span className="text-muted-foreground">Action: </span>
								{rule.action.type} → {rule.action.value || "—"}
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
									disabled={index === rules.length - 1 || reorderMutation.isPending}
									onClick={() => moveDown(index)}
									aria-label="Move down"
								>
									▼
								</Button>
							</div>

							{/* Toggle */}
							<Switch
								checked={rule.active}
								onCheckedChange={() => handleToggle(rule.id)}
								disabled={toggleMutation.isPending}
								aria-label="Toggle rule active"
							/>

							{/* Edit */}
							<RuleDialog
								trigger={
									<Button variant="outline" size="sm">
										Edit
									</Button>
								}
								title="Edit Rule"
								initialName={rule.name}
								initialRule={{ conditions: rule.conditions, action: rule.action }}
								onSave={(name, updatedRule) => handleUpdate(rule.id, name, updatedRule)}
								isSaving={updateMutation.isPending}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

// ─── Routing Log Tab ──────────────────────────────────────────────────────────

interface LogRow {
	id: string
	caseId: string
	matchedRuleName: string | null
	assignedTeam: string | null
	timestamp: string
}

function RoutingLogTab() {
	const { data, isLoading } = useRoutingLogQuery()

	const rows: LogRow[] = (data?.rows ?? []).map((row, i) => ({
		id: row.caseId + i,
		caseId: row.caseId,
		matchedRuleName: row.matchedRuleName,
		assignedTeam: row.assignedTeam,
		timestamp: row.timestamp,
	}))

	return (
		<AdminDataTable
			columns={[
				{
					key: "caseId",
					header: "Case ID",
					render: row => row.caseId,
				},
				{
					key: "matchedRuleName",
					header: "Matched Rule",
					render: row => row.matchedRuleName ?? "—",
				},
				{
					key: "assignedTeam",
					header: "Assigned Team",
					render: row => row.assignedTeam ?? "—",
				},
				{
					key: "timestamp",
					header: "Timestamp",
					render: row => new Date(row.timestamp).toLocaleString(),
				},
			]}
			rows={rows}
			isLoading={isLoading}
			emptyMessage="No routing log entries found."
		/>
	)
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function RoutingRulesPage() {
	const [activeTab, setActiveTab] = React.useState<"rules" | "log">("rules")

	return (
		<div className="flex flex-col gap-4">
			{/* Tab bar */}
			<div className="flex gap-1 border-b">
				{(["rules", "log"] as const).map(tab => (
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
						{tab === "rules" ? "Rules" : "Routing Log"}
					</button>
				))}
			</div>

			{activeTab === "rules" && <RulesTab />}
			{activeTab === "log" && <RoutingLogTab />}
		</div>
	)
}
