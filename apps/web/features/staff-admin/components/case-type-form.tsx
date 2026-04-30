"use client"

import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
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
import {
	useCreateCaseTypeMutation,
	useUpdateCaseTypeMutation,
} from "@/features/staff-admin/api/admin.hooks"

type Priority = "low" | "medium" | "high" | "urgent"

interface CaseTypeFormProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	initialData?: {
		id?: string
		name: string
		description: string | null
		defaultPriority: Priority
		slaHours: number
		defaultTeam: string | null
		requiredFields: string[]
		optionalFields: string[]
		defaultRoutingRuleId: string | null
	}
}

interface FormState {
	name: string
	description: string
	defaultPriority: Priority
	slaHours: string
	defaultTeam: string
	requiredFields: string
	optionalFields: string
	defaultRoutingRuleId: string
}

function toFormState(data: CaseTypeFormProps["initialData"]): FormState {
	if (!data) {
		return {
			name: "",
			description: "",
			defaultPriority: "medium",
			slaHours: "48",
			defaultTeam: "",
			requiredFields: "",
			optionalFields: "",
			defaultRoutingRuleId: "",
		}
	}
	return {
		name: data.name,
		description: data.description ?? "",
		defaultPriority: data.defaultPriority,
		slaHours: String(data.slaHours),
		defaultTeam: data.defaultTeam ?? "",
		requiredFields: data.requiredFields.join(", "),
		optionalFields: data.optionalFields.join(", "),
		defaultRoutingRuleId: data.defaultRoutingRuleId ?? "",
	}
}

function parseFields(value: string): string[] {
	return value
		.split(",")
		.map(s => s.trim())
		.filter(Boolean)
}

export function CaseTypeForm({ open, onOpenChange, initialData }: CaseTypeFormProps) {
	const [form, setForm] = React.useState<FormState>(() => toFormState(initialData))

	const createMutation = useCreateCaseTypeMutation()
	const updateMutation = useUpdateCaseTypeMutation()

	const isEdit = Boolean(initialData?.id)
	const isPending = createMutation.isPending || updateMutation.isPending

	// Sync form when initialData changes
	React.useEffect(() => {
		setForm(toFormState(initialData))
	}, [initialData, open])

	function set(key: keyof FormState, value: string) {
		setForm(prev => ({ ...prev, [key]: value }))
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()

		const slaHoursNum = parseInt(form.slaHours, 10)
		if (!form.name.trim()) {
			toast.error("Name is required.")
			return
		}
		if (isNaN(slaHoursNum) || slaHoursNum <= 0) {
			toast.error("SLA hours must be a positive integer.")
			return
		}

		const payload = {
			name: form.name.trim(),
			description: form.description.trim() || null,
			defaultPriority: form.defaultPriority,
			slaHours: slaHoursNum,
			defaultTeam: form.defaultTeam.trim() || null,
			requiredFields: parseFields(form.requiredFields),
			optionalFields: parseFields(form.optionalFields),
			defaultRoutingRuleId: form.defaultRoutingRuleId.trim() || null,
		}

		try {
			if (isEdit && initialData?.id) {
				await updateMutation.mutateAsync({ id: initialData.id, ...payload })
				toast.success("Case type updated.")
			} else {
				await createMutation.mutateAsync(payload)
				toast.success("Case type created.")
			}
			onOpenChange(false)
		} catch {
			toast.error(isEdit ? "Failed to update case type." : "Failed to create case type.")
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>{isEdit ? "Edit Case Type" : "Add Case Type"}</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					{/* Name */}
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="ct-name">
							Name <span className="text-destructive">*</span>
						</Label>
						<Input
							id="ct-name"
							value={form.name}
							onChange={e => set("name", e.target.value)}
							placeholder="e.g. LOA Request"
							required
						/>
					</div>

					{/* Description */}
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="ct-description">Description</Label>
						<Textarea
							id="ct-description"
							value={form.description}
							onChange={e => set("description", e.target.value)}
							placeholder="Optional description…"
							className="min-h-16"
						/>
					</div>

					{/* Default priority + SLA hours row */}
					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="ct-priority">Default Priority</Label>
							<Select
								value={form.defaultPriority}
								onValueChange={(val: Priority | null) => {
									if (val) set("defaultPriority", val)
								}}
							>
								<SelectTrigger id="ct-priority" className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="low">Low</SelectItem>
									<SelectItem value="medium">Medium</SelectItem>
									<SelectItem value="high">High</SelectItem>
									<SelectItem value="urgent">Urgent</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label htmlFor="ct-sla">
								SLA Hours <span className="text-destructive">*</span>
							</Label>
							<Input
								id="ct-sla"
								type="number"
								min={1}
								step={1}
								value={form.slaHours}
								onChange={e => set("slaHours", e.target.value)}
								placeholder="48"
								required
							/>
						</div>
					</div>

					{/* Default team */}
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="ct-team">Default Team</Label>
						<Input
							id="ct-team"
							value={form.defaultTeam}
							onChange={e => set("defaultTeam", e.target.value)}
							placeholder="e.g. LOA Triage"
						/>
					</div>

					{/* Required fields */}
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="ct-required">Required Fields</Label>
						<Input
							id="ct-required"
							value={form.requiredFields}
							onChange={e => set("requiredFields", e.target.value)}
							placeholder="patientName, dateOfRequest"
						/>
						<p className="text-muted-foreground text-xs">Comma-separated field names.</p>
					</div>

					{/* Optional fields */}
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="ct-optional">Optional Fields</Label>
						<Input
							id="ct-optional"
							value={form.optionalFields}
							onChange={e => set("optionalFields", e.target.value)}
							placeholder="attendingPhysician"
						/>
						<p className="text-muted-foreground text-xs">Comma-separated field names.</p>
					</div>

					{/* Default routing rule */}
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="ct-routing">Default Routing Rule ID</Label>
						<Input
							id="ct-routing"
							value={form.defaultRoutingRuleId}
							onChange={e => set("defaultRoutingRuleId", e.target.value)}
							placeholder="Optional routing rule ID"
						/>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending ? "Saving…" : isEdit ? "Update" : "Create"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
