"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { authClient } from "@/services/better-auth/auth-client"
import { PortalAlert } from "@/features/portal-shared/components/portal-alert"
import { PortalField } from "@/features/portal-shared/components/portal-field"
import { PortalForm } from "@/features/portal-shared/components/portal-form"

interface FormState {
	fullName: string
	email: string
	dateOfBirth: string
	mobilePhone: string
	password: string
	dpa: boolean
	terms: boolean
}

const INITIAL: FormState = {
	fullName: "",
	email: "",
	dateOfBirth: "",
	mobilePhone: "",
	password: "",
	dpa: false,
	terms: false,
}

function passwordHints(pw: string): string[] {
	const hints: string[] = []
	if (pw.length < 8) hints.push("At least 8 characters")
	if (!/[A-Z]/.test(pw)) hints.push("Includes an uppercase letter")
	if (!/[0-9]/.test(pw)) hints.push("Includes a digit")
	if (!/[^A-Za-z0-9]/.test(pw)) hints.push("Includes a symbol")
	return hints
}

export function RegistrationForm() {
	const router = useRouter()
	const [form, setForm] = useState<FormState>(INITIAL)
	const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
	const [isPending, setIsPending] = useState(false)
	const [submitted, setSubmitted] = useState(false)

	function update<K extends keyof FormState>(key: K, value: FormState[K]) {
		setForm(prev => ({ ...prev, [key]: value }))
		setErrors(prev => ({ ...prev, [key]: undefined }))
	}

	function validate(): boolean {
		const next: Partial<Record<keyof FormState, string>> = {}
		if (form.fullName.trim().length < 2) next.fullName = "Full name is required."
		if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) next.email = "Enter a valid email."
		if (!/^\d{4}-\d{2}-\d{2}$/.test(form.dateOfBirth))
			next.dateOfBirth = "Date of birth is required."
		if (form.mobilePhone.trim().length < 7)
			next.mobilePhone = "Mobile phone is required."
		if (passwordHints(form.password).length > 0)
			next.password = "Password does not meet complexity rules."
		if (!form.dpa) next.dpa = "Acknowledge the Data Privacy Act notice."
		if (!form.terms) next.terms = "Accept the Terms & Conditions to continue."
		setErrors(next)
		return Object.keys(next).length === 0
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (!validate()) return
		setIsPending(true)
		try {
			await authClient.signUp.email({
				email: form.email,
				password: form.password,
				name: form.fullName,
			})
			toast.success("Account created", {
				description: "Check your email for a verification link.",
			})
			setSubmitted(true)
			router.push(
				`/portal/verify-email?email=${encodeURIComponent(form.email)}`
			)
		} catch (err) {
			toast.error("Could not register", { description: (err as Error).message })
		} finally {
			setIsPending(false)
		}
	}

	if (submitted) {
		return (
			<PortalAlert
				variant="success"
				title="Verification email sent"
				description={`We sent a verification link to ${form.email}. Click it to activate your account.`}
			/>
		)
	}

	const pwHints = passwordHints(form.password)

	return (
		<PortalForm onSubmit={handleSubmit}>
			<PortalField
				label="Full name"
				htmlFor="reg-name"
				required
				error={errors.fullName ?? null}
			>
				<Input
					id="reg-name"
					value={form.fullName}
					onChange={e => update("fullName", e.target.value)}
					autoComplete="name"
				/>
			</PortalField>
			<PortalField label="Email" htmlFor="reg-email" required error={errors.email ?? null}>
				<Input
					id="reg-email"
					type="email"
					value={form.email}
					onChange={e => update("email", e.target.value)}
					autoComplete="email"
				/>
			</PortalField>
			<PortalField
				label="Date of birth"
				htmlFor="reg-dob"
				required
				error={errors.dateOfBirth ?? null}
			>
				<Input
					id="reg-dob"
					type="date"
					value={form.dateOfBirth}
					onChange={e => update("dateOfBirth", e.target.value)}
				/>
			</PortalField>
			<PortalField
				label="Mobile phone"
				htmlFor="reg-mobile"
				required
				error={errors.mobilePhone ?? null}
			>
				<Input
					id="reg-mobile"
					type="tel"
					value={form.mobilePhone}
					onChange={e => update("mobilePhone", e.target.value)}
					autoComplete="tel"
					placeholder="+63 917 555 1234"
				/>
			</PortalField>
			<PortalField
				label="Password"
				htmlFor="reg-password"
				required
				error={errors.password ?? null}
				hint="At least 8 characters with an uppercase letter, a digit, and a symbol."
			>
				<Input
					id="reg-password"
					type="password"
					value={form.password}
					onChange={e => update("password", e.target.value)}
					autoComplete="new-password"
				/>
				{pwHints.length > 0 && form.password.length > 0 ? (
					<ul className="text-muted-foreground mt-1 list-disc pl-4 text-[11px]">
						{pwHints.map(h => (
							<li key={h}>{h}</li>
						))}
					</ul>
				) : null}
			</PortalField>

			<div className="flex flex-col gap-2">
				<label className="text-foreground inline-flex items-start gap-2 text-sm">
					<input
						type="checkbox"
						checked={form.dpa}
						onChange={e => update("dpa", e.target.checked)}
						className="mt-0.5 size-4"
					/>
					<span>
						I acknowledge the{" "}
						<a href="/legal/dpa" className="text-primary hover:underline">
							Data Privacy Act
						</a>{" "}
						notice on how SLMC processes my information.
					</span>
				</label>
				{errors.dpa ? (
					<p className="text-destructive text-xs">{errors.dpa}</p>
				) : null}
				<label className="text-foreground inline-flex items-start gap-2 text-sm">
					<input
						type="checkbox"
						checked={form.terms}
						onChange={e => update("terms", e.target.checked)}
						className="mt-0.5 size-4"
					/>
					<span>
						I accept the{" "}
						<a href="/legal/terms" className="text-primary hover:underline">
							Terms &amp; Conditions
						</a>
						.
					</span>
				</label>
				{errors.terms ? (
					<p className="text-destructive text-xs">{errors.terms}</p>
				) : null}
			</div>

			<Button type="submit" disabled={isPending} className="w-fit">
				{isPending ? "Creating account…" : "Create account"}
			</Button>
		</PortalForm>
	)
}
