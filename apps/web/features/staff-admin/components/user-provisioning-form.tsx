"use client"

import * as React from "react"
import { toast } from "sonner"

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/core/components/ui/dialog"
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/core/components/ui/field"
import { Input } from "@/core/components/ui/input"
import { Button } from "@/core/components/ui/button"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select"

import { useInviteUserMutation } from "@/features/staff-admin/api/admin.hooks"

interface UserProvisioningFormProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

type RoleOption = "case_agent" | "case_supervisor" | "clinician" | "tenant_admin"

const ROLE_OPTIONS: { value: RoleOption; label: string }[] = [
	{ value: "case_agent", label: "Case Agent" },
	{ value: "case_supervisor", label: "Case Supervisor" },
	{ value: "clinician", label: "Clinician" },
	{ value: "tenant_admin", label: "Tenant Admin" },
]

const ROLE_PERMISSION_SUMMARIES: Record<RoleOption, string> = {
	case_agent: "Can create and manage cases assigned to them.",
	case_supervisor: "Can create, manage, and escalate cases. Oversees case agents.",
	clinician: "Can view patient records and cases relevant to their practice.",
	tenant_admin: "Full administrative access within the tenant. Can manage users and settings.",
}

function isValidEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

interface FormState {
	fullName: string
	email: string
	jobTitle: string
	department: string
	role: RoleOption | ""
}

interface FormErrors {
	fullName?: string
	email?: string
	role?: string
}

export function UserProvisioningForm({ open, onOpenChange }: UserProvisioningFormProps) {
	const [form, setForm] = React.useState<FormState>({
		fullName: "",
		email: "",
		jobTitle: "",
		department: "",
		role: "",
	})
	const [errors, setErrors] = React.useState<FormErrors>({})

	const { mutate, isPending } = useInviteUserMutation()

	function resetForm() {
		setForm({ fullName: "", email: "", jobTitle: "", department: "", role: "" })
		setErrors({})
	}

	function handleOpenChange(nextOpen: boolean) {
		if (!nextOpen) resetForm()
		onOpenChange(nextOpen)
	}

	function validate(): boolean {
		const next: FormErrors = {}
		if (!form.fullName.trim()) next.fullName = "Full name is required"
		if (!form.email.trim()) {
			next.email = "Email is required"
		} else if (!isValidEmail(form.email)) {
			next.email = "Please enter a valid email address"
		}
		if (!form.role) next.role = "Please select a role"
		setErrors(next)
		return Object.keys(next).length === 0
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (!validate()) return

		mutate(
			{
				email: form.email,
				role: form.role as RoleOption,
			},
			{
				onSuccess: () => {
					toast.success("User invited")
					handleOpenChange(false)
				},
				onError: (err) => {
					toast.error(err instanceof Error ? err.message : "Failed to invite user")
				},
			}
		)
	}

	const permissionSummary =
		form.role ? ROLE_PERMISSION_SUMMARIES[form.role as RoleOption] : null

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-md">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Invite New User</DialogTitle>
					</DialogHeader>

					<FieldGroup className="py-4">
						<Field data-invalid={!!errors.fullName}>
							<FieldLabel htmlFor="prov-full-name">Full Name</FieldLabel>
							<Input
								id="prov-full-name"
								value={form.fullName}
								onChange={e => {
									setForm(prev => ({ ...prev, fullName: e.target.value }))
									if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined }))
								}}
								placeholder="Jane Smith"
								disabled={isPending}
								aria-invalid={!!errors.fullName}
							/>
							{errors.fullName && <FieldError>{errors.fullName}</FieldError>}
						</Field>

						<Field data-invalid={!!errors.email}>
							<FieldLabel htmlFor="prov-email">Email</FieldLabel>
							<Input
								id="prov-email"
								type="email"
								value={form.email}
								onChange={e => {
									setForm(prev => ({ ...prev, email: e.target.value }))
									if (errors.email) setErrors(prev => ({ ...prev, email: undefined }))
								}}
								placeholder="jane@example.com"
								autoComplete="off"
								disabled={isPending}
								aria-invalid={!!errors.email}
							/>
							{errors.email && <FieldError>{errors.email}</FieldError>}
						</Field>

						<Field>
							<FieldLabel htmlFor="prov-job-title">Job Title</FieldLabel>
							<Input
								id="prov-job-title"
								value={form.jobTitle}
								onChange={e => setForm(prev => ({ ...prev, jobTitle: e.target.value }))}
								placeholder="e.g. Senior Case Agent"
								disabled={isPending}
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor="prov-department">Department</FieldLabel>
							<Input
								id="prov-department"
								value={form.department}
								onChange={e => setForm(prev => ({ ...prev, department: e.target.value }))}
								placeholder="e.g. LOA Processing"
								disabled={isPending}
							/>
						</Field>

						<Field data-invalid={!!errors.role}>
							<FieldLabel>Role</FieldLabel>
							<Select
								value={form.role}
								onValueChange={(value) => {
									setForm(prev => ({ ...prev, role: (value ?? "") as RoleOption | "" }))
									if (errors.role) setErrors(prev => ({ ...prev, role: undefined }))
								}}
								disabled={isPending}
							>
								<SelectTrigger className="w-full" aria-invalid={!!errors.role}>
									<SelectValue>{form.role ? ROLE_OPTIONS.find(r => r.value === form.role)?.label : <span className="text-muted-foreground">Select a role…</span>}</SelectValue>
								</SelectTrigger>
								<SelectContent>
									{ROLE_OPTIONS.map(opt => (
										<SelectItem key={opt.value} value={opt.value}>
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.role && <FieldError>{errors.role}</FieldError>}
						</Field>

						{permissionSummary && (
							<div className="bg-muted rounded-lg px-3 py-2 text-sm">
								<span className="text-muted-foreground font-medium">Permissions: </span>
								<span className="text-foreground">{permissionSummary}</span>
							</div>
						)}
					</FieldGroup>

					<DialogFooter showCloseButton>
						<Button type="submit" disabled={isPending}>
							{isPending ? "Inviting..." : "Send Invite"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
