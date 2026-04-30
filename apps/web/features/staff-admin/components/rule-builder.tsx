"use client"

import * as React from "react"
import { Delete02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select"

export type ConditionField =
	| "case_type"
	| "priority"
	| "source_channel"
	| "hmo_type"
	| "keyword"

export type ConditionOperator = "equals" | "contains" | "not_equals"

export type ActionType =
	| "assign_team"
	| "assign_agent"
	| "set_priority"
	| "add_label"

export interface Condition {
	field: ConditionField
	operator: ConditionOperator
	value: string
}

export interface RuleAction {
	type: ActionType
	value: string
}

export interface Rule {
	conditions: Condition[]
	action: RuleAction
}

interface RuleBuilderProps {
	value: Rule
	onChange: (rule: Rule) => void
	fieldOptions?: { value: ConditionField; label: string }[]
	actionOptions?: { value: ActionType; label: string }[]
}

const DEFAULT_FIELD_OPTIONS: { value: ConditionField; label: string }[] = [
	{ value: "case_type", label: "Case Type" },
	{ value: "priority", label: "Priority" },
	{ value: "source_channel", label: "Source Channel" },
	{ value: "hmo_type", label: "HMO Type" },
	{ value: "keyword", label: "Keyword" },
]

const OPERATOR_OPTIONS: { value: ConditionOperator; label: string }[] = [
	{ value: "equals", label: "Equals" },
	{ value: "contains", label: "Contains" },
	{ value: "not_equals", label: "Not Equals" },
]

const DEFAULT_ACTION_OPTIONS: { value: ActionType; label: string }[] = [
	{ value: "assign_team", label: "Assign Team" },
	{ value: "assign_agent", label: "Assign Agent" },
	{ value: "set_priority", label: "Set Priority" },
	{ value: "add_label", label: "Add Label" },
]

export function RuleBuilder({
	value,
	onChange,
	fieldOptions = DEFAULT_FIELD_OPTIONS,
	actionOptions = DEFAULT_ACTION_OPTIONS,
}: RuleBuilderProps) {
	function updateCondition(index: number, patch: Partial<Condition>) {
		const updated = value.conditions.map((c, i) => (i === index ? { ...c, ...patch } : c))
		onChange({ ...value, conditions: updated })
	}

	function removeCondition(index: number) {
		onChange({ ...value, conditions: value.conditions.filter((_, i) => i !== index) })
	}

	function addCondition() {
		const newCondition: Condition = {
			field: "case_type",
			operator: "equals",
			value: "",
		}
		onChange({ ...value, conditions: [...value.conditions, newCondition] })
	}

	function updateAction(patch: Partial<RuleAction>) {
		onChange({ ...value, action: { ...value.action, ...patch } })
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2">
				<p className="text-sm font-medium">Conditions</p>
				{value.conditions.length === 0 && (
					<p className="text-muted-foreground text-sm">No conditions added yet.</p>
				)}
				{value.conditions.map((condition, index) => (
					<div key={index} className="flex items-center gap-2">
						<Select
							value={condition.field}
							onValueChange={v => updateCondition(index, { field: v as ConditionField })}
						>
							<SelectTrigger className="w-40">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{fieldOptions.map(opt => (
									<SelectItem key={opt.value} value={opt.value}>
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select
							value={condition.operator}
							onValueChange={v => updateCondition(index, { operator: v as ConditionOperator })}
						>
							<SelectTrigger className="w-36">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{OPERATOR_OPTIONS.map(opt => (
									<SelectItem key={opt.value} value={opt.value}>
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Input
							className="flex-1"
							placeholder="Value"
							value={condition.value}
							onChange={e => updateCondition(index, { value: e.target.value })}
						/>

						<Button
							variant="ghost"
							size="icon-sm"
							aria-label="Remove condition"
							onClick={() => removeCondition(index)}
						>
							<HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
						</Button>
					</div>
				))}
				<Button variant="outline" size="sm" className="w-fit" onClick={addCondition}>
					Add Condition
				</Button>
			</div>

			<div className="border-t pt-4">
				<p className="mb-2 text-sm font-medium">Action</p>
				<div className="flex items-center gap-2">
					<Select
						value={value.action.type}
						onValueChange={v => updateAction({ type: v as ActionType })}
					>
						<SelectTrigger className="w-44">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{actionOptions.map(opt => (
								<SelectItem key={opt.value} value={opt.value}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Input
						className="flex-1"
						placeholder="Action value"
						value={value.action.value}
						onChange={e => updateAction({ value: e.target.value })}
					/>
				</div>
			</div>
		</div>
	)
}
