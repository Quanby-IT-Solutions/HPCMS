"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import { Checkbox } from "@/core/components/ui/checkbox"
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
import { useCaseTypesQuery, useProvisionFacilityMutation } from "@/features/staff-admin/api/admin.hooks"
import { ADMIN_ROUTES } from "@/features/staff-admin/lib/admin-routes"

import { AdminWizard } from "./admin-wizard"

// ─── Form State ───────────────────────────────────────────────────────────────

interface Department {
	name: string
	careTeams: string
}

interface WizardFormState {
	// Step 1 — Identity
	facilityName: string
	shortCode: string
	address: string
	contactEmail: string
	contactPhone: string
	// Step 2 — Default Settings
	defaultCaseTypeIds: string[]
	defaultSlaHours: number
	notificationTemplate: string
	// Step 3 — Departments
	departments: Department[]
	// Step 4 — Initial User
	initialUserEmail: string
	initialUserFullName: string
}

// ─── Step 1: Identity ─────────────────────────────────────────────────────────

interface Step1Props {
	form: WizardFormState
	setForm: React.Dispatch<React.SetStateAction<WizardFormState>>
}

function StepIdentity({ form, setForm }: Step1Props) {
	function update(patch: Partial<WizardFormState>) {
		setForm(prev => ({ ...prev, ...patch }))
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1.5">
				<Label>
					Facility Name <span className="text-destructive">*</span>
				</Label>
				<Input
					value={form.facilityName}
					onChange={e => update({ facilityName: e.target.value })}
					placeholder="HPCMS Hospital QC"
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label>
					Short Code <span className="text-destructive">*</span>
				</Label>
				<Input
					value={form.shortCode}
					onChange={e => update({ shortCode: e.target.value.toUpperCase() })}
					placeholder="QC"
					maxLength={10}
				/>
				<p className="text-muted-foreground text-xs">2–10 uppercase characters</p>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label>Address</Label>
				<Textarea
					value={form.address}
					onChange={e => update({ address: e.target.value })}
					placeholder="123 Medical Drive, Quezon City"
					rows={3}
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label>Contact Email</Label>
				<Input
					type="email"
					value={form.contactEmail}
					onChange={e => update({ contactEmail: e.target.value })}
					placeholder="contact@facility.com"
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label>Contact Phone</Label>
				<Input
					value={form.contactPhone}
					onChange={e => update({ contactPhone: e.target.value })}
					placeholder="+63 2 1234 5678"
				/>
			</div>
		</div>
	)
}

// ─── Step 2: Default Settings ─────────────────────────────────────────────────

interface Step2Props {
	form: WizardFormState
	setForm: React.Dispatch<React.SetStateAction<WizardFormState>>
}

function StepDefaultSettings({ form, setForm }: Step2Props) {
	const { data: caseTypesData } = useCaseTypesQuery()
	const activeCaseTypes = (caseTypesData?.items ?? []).filter(ct => ct.status === "active")

	function toggleCaseType(id: string) {
		setForm(prev => ({
			...prev,
			defaultCaseTypeIds: prev.defaultCaseTypeIds.includes(id)
				? prev.defaultCaseTypeIds.filter(x => x !== id)
				: [...prev.defaultCaseTypeIds, id],
		}))
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2">
				<Label>Default Case Types</Label>
				{activeCaseTypes.length === 0 && (
					<p className="text-muted-foreground text-sm">No active case types available.</p>
				)}
				{activeCaseTypes.map(ct => (
					<label key={ct.id} className="flex items-center gap-2 cursor-pointer">
						<Checkbox
							checked={form.defaultCaseTypeIds.includes(ct.id)}
							onCheckedChange={() => toggleCaseType(ct.id)}
						/>
						<span className="text-sm">{ct.name}</span>
					</label>
				))}
			</div>

			<div className="flex flex-col gap-1.5">
				<Label>
					Default SLA Hours <span className="text-destructive">*</span>
				</Label>
				<Input
					type="number"
					value={form.defaultSlaHours}
					onChange={e => setForm(prev => ({ ...prev, defaultSlaHours: Number(e.target.value) }))}
					min={1}
					placeholder="48"
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label>Notification Template</Label>
				<Select
					value={form.notificationTemplate}
					onValueChange={v => setForm(prev => ({ ...prev, notificationTemplate: v ?? "" }))}
				>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="Standard">Standard</SelectItem>
						<SelectItem value="Urgent">Urgent</SelectItem>
						<SelectItem value="Quiet">Quiet</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	)
}

// ─── Step 3: Departments ──────────────────────────────────────────────────────

interface Step3Props {
	form: WizardFormState
	setForm: React.Dispatch<React.SetStateAction<WizardFormState>>
}

function StepDepartments({ form, setForm }: Step3Props) {
	function addDepartment() {
		setForm(prev => ({
			...prev,
			departments: [...prev.departments, { name: "", careTeams: "" }],
		}))
	}

	function removeDepartment(index: number) {
		setForm(prev => ({
			...prev,
			departments: prev.departments.filter((_, i) => i !== index),
		}))
	}

	function updateDepartment(index: number, patch: Partial<Department>) {
		setForm(prev => ({
			...prev,
			departments: prev.departments.map((d, i) => (i === index ? { ...d, ...patch } : d)),
		}))
	}

	return (
		<div className="flex flex-col gap-4">
			<p className="text-muted-foreground text-sm">
				Add at least one department. Care teams are comma-separated.
			</p>

			{form.departments.length === 0 && (
				<p className="text-sm text-muted-foreground italic">No departments added yet.</p>
			)}

			{form.departments.map((dept, index) => {
				const careTeamChips = dept.careTeams.split(",").map(s => s.trim()).filter(Boolean)
				return (
					<div key={index} className="flex flex-col gap-2 rounded-lg border p-3">
						<div className="flex items-center gap-2">
							<div className="flex-1 flex flex-col gap-1.5">
								<Label>Department Name</Label>
								<Input
									value={dept.name}
									onChange={e => updateDepartment(index, { name: e.target.value })}
									placeholder="e.g., Emergency"
								/>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="mt-5 text-destructive hover:text-destructive"
								onClick={() => removeDepartment(index)}
							>
								Remove
							</Button>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label>Care Teams (comma-separated)</Label>
							<Input
								value={dept.careTeams}
								onChange={e => updateDepartment(index, { careTeams: e.target.value })}
								placeholder="Team A, Team B"
							/>
							{careTeamChips.length > 0 && (
								<div className="flex flex-wrap gap-1 mt-1">
									{careTeamChips.map(team => (
										<Badge key={team} variant="secondary">{team}</Badge>
									))}
								</div>
							)}
						</div>
					</div>
				)
			})}

			<Button variant="outline" size="sm" className="w-fit" onClick={addDepartment}>
				Add Department
			</Button>
		</div>
	)
}

// ─── Step 4: Initial User ─────────────────────────────────────────────────────

interface Step4Props {
	form: WizardFormState
	setForm: React.Dispatch<React.SetStateAction<WizardFormState>>
}

function StepInitialUser({ form, setForm }: Step4Props) {
	function update(patch: Partial<WizardFormState>) {
		setForm(prev => ({ ...prev, ...patch }))
	}

	return (
		<div className="flex flex-col gap-4">
			<p className="text-muted-foreground text-sm italic">
				This step is optional. You can skip it and invite a user later.
			</p>

			<div className="flex flex-col gap-1.5">
				<Label>Email</Label>
				<Input
					type="email"
					value={form.initialUserEmail}
					onChange={e => update({ initialUserEmail: e.target.value })}
					placeholder="admin@facility.com"
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label>Full Name</Label>
				<Input
					value={form.initialUserFullName}
					onChange={e => update({ initialUserFullName: e.target.value })}
					placeholder="Juan dela Cruz"
				/>
			</div>
		</div>
	)
}

// ─── Step 5: Review & Activate ────────────────────────────────────────────────

interface Step5Props {
	form: WizardFormState
}

function StepReview({ form }: Step5Props) {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1.5">
				<p className="text-sm font-semibold">Identity</p>
				<dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
					<dt className="text-muted-foreground">Name</dt>
					<dd>{form.facilityName || "—"}</dd>
					<dt className="text-muted-foreground">Short Code</dt>
					<dd>{form.shortCode || "—"}</dd>
					<dt className="text-muted-foreground">Address</dt>
					<dd>{form.address || "—"}</dd>
					<dt className="text-muted-foreground">Contact Email</dt>
					<dd>{form.contactEmail || "—"}</dd>
					<dt className="text-muted-foreground">Contact Phone</dt>
					<dd>{form.contactPhone || "—"}</dd>
				</dl>
			</div>

			<div className="flex flex-col gap-1.5">
				<p className="text-sm font-semibold">Default Settings</p>
				<dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
					<dt className="text-muted-foreground">Case Type IDs</dt>
					<dd>{form.defaultCaseTypeIds.length > 0 ? form.defaultCaseTypeIds.join(", ") : "None selected"}</dd>
					<dt className="text-muted-foreground">SLA Hours</dt>
					<dd>{form.defaultSlaHours}</dd>
					<dt className="text-muted-foreground">Notification Template</dt>
					<dd>{form.notificationTemplate || "—"}</dd>
				</dl>
			</div>

			<div className="flex flex-col gap-1.5">
				<p className="text-sm font-semibold">Departments</p>
				{form.departments.length === 0 ? (
					<p className="text-muted-foreground text-sm">No departments added.</p>
				) : (
					<ul className="flex flex-col gap-2 text-sm">
						{form.departments.map((dept, i) => (
							<li key={i}>
								<span className="font-medium">{dept.name || "(unnamed)"}</span>
								{dept.careTeams && (
									<span className="text-muted-foreground"> — {dept.careTeams}</span>
								)}
							</li>
						))}
					</ul>
				)}
			</div>

			<div className="flex flex-col gap-1.5">
				<p className="text-sm font-semibold">Initial User</p>
				{!form.initialUserEmail && !form.initialUserFullName ? (
					<p className="text-muted-foreground text-sm">Skipped.</p>
				) : (
					<dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
						<dt className="text-muted-foreground">Email</dt>
						<dd>{form.initialUserEmail || "—"}</dd>
						<dt className="text-muted-foreground">Full Name</dt>
						<dd>{form.initialUserFullName || "—"}</dd>
					</dl>
				)}
			</div>
		</div>
	)
}

// ─── Wizard Entry Point ────────────────────────────────────────────────────────

export function FacilityWizard() {
	const router = useRouter()
	const provisionMutation = useProvisionFacilityMutation()

	const [form, setForm] = React.useState<WizardFormState>({
		facilityName: "",
		shortCode: "",
		address: "",
		contactEmail: "",
		contactPhone: "",
		defaultCaseTypeIds: [],
		defaultSlaHours: 48,
		notificationTemplate: "Standard",
		departments: [],
		initialUserEmail: "",
		initialUserFullName: "",
	})

	function validateStep1() {
		const nameOk = form.facilityName.trim().length > 0
		const shortCodeOk = form.shortCode.trim().length >= 2 && form.shortCode.trim().length <= 10
		const emailOk =
			form.contactEmail.length === 0 ||
			/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)
		return nameOk && shortCodeOk && emailOk
	}

	function validateStep2() {
		return form.defaultSlaHours > 0
	}

	function validateStep3() {
		return form.departments.length > 0
	}

	function validateStep4() {
		const hasEmail = form.initialUserEmail.trim().length > 0
		const hasName = form.initialUserFullName.trim().length > 0
		// Both filled or both empty
		if (hasEmail || hasName) {
			return (
				hasEmail &&
				hasName &&
				/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.initialUserEmail)
			)
		}
		return true
	}

	function handleFinish() {
		const hasInitialUser =
			form.initialUserEmail.trim().length > 0 &&
			form.initialUserFullName.trim().length > 0

		provisionMutation.mutate(
			{
				identity: {
					name: form.facilityName,
					shortCode: form.shortCode,
					address: form.address || null,
					contactEmail: form.contactEmail || null,
					contactPhone: form.contactPhone || null,
				},
				defaultSettings: {
					defaultCaseTypeIds: form.defaultCaseTypeIds,
					defaultSlaHours: form.defaultSlaHours,
					notificationTemplateId: form.notificationTemplate || null,
				},
				departments: form.departments.map(d => ({
					name: d.name,
					careTeams: d.careTeams.split(",").map(s => s.trim()).filter(Boolean),
				})),
				...(hasInitialUser
					? {
							initialAdmin: {
								email: form.initialUserEmail,
								fullName: form.initialUserFullName,
							},
					  }
					: {}),
			},
			{
				onSuccess: () => {
					toast.success("Facility activated successfully.")
					router.push(ADMIN_ROUTES.tenants)
				},
			}
		)
	}

	const steps = [
		{
			title: "Identity",
			validator: validateStep1,
			content: <StepIdentity form={form} setForm={setForm} />,
		},
		{
			title: "Default Settings",
			validator: validateStep2,
			content: <StepDefaultSettings form={form} setForm={setForm} />,
		},
		{
			title: "Departments",
			validator: validateStep3,
			content: <StepDepartments form={form} setForm={setForm} />,
		},
		{
			title: "Initial User",
			validator: validateStep4,
			content: <StepInitialUser form={form} setForm={setForm} />,
		},
		{
			title: "Review & Activate",
			content: <StepReview form={form} />,
		},
	]

	return (
		<AdminWizard
			steps={steps}
			onFinish={handleFinish}
			isFinishing={provisionMutation.isPending}
		/>
	)
}
