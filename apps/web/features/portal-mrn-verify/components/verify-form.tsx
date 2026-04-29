"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/core/components/ui/card"
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/core/components/ui/field"
import { Input } from "@/core/components/ui/input"

import { useVerifyMrnMutation } from "../api/mrn.hooks"
import { FacilityMismatchModal } from "./facility-mismatch-modal"
import { LockoutBanner } from "./lockout-banner"

interface VerifyFormState {
	mrn: string
	dateOfBirth: string
	lastName: string
}

type FormErrors = Partial<Record<keyof VerifyFormState, { message: string }>>

interface MismatchState {
	otherTenantId: string
}

export function VerifyForm() {
	const router = useRouter()
	const { mutateAsync: verifyMrn, isPending } = useVerifyMrnMutation()

	const [values, setValues] = useState<VerifyFormState>({
		mrn: "",
		dateOfBirth: "",
		lastName: "",
	})
	const [errors, setErrors] = useState<FormErrors>({})
	const [lockedUntilMs, setLockedUntilMs] = useState<number | null>(null)
	const [mismatch, setMismatch] = useState<MismatchState | null>(null)
	const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null)

	function validate(): boolean {
		const next: FormErrors = {}
		if (!values.mrn.trim()) next.mrn = { message: "MRN is required" }
		if (!values.dateOfBirth) next.dateOfBirth = { message: "Date of birth is required" }
		if (!values.lastName.trim()) next.lastName = { message: "Last name is required" }
		setErrors(next)
		return Object.keys(next).length === 0
	}

	async function submit(switchTenantTo?: string) {
		if (!validate()) return

		try {
			const result = await verifyMrn({ ...values, switchTenantTo })

			if (result.outcome === "linked") {
				toast.success("Patient record verified successfully!")
				router.push("/portal/my-requests")
				router.refresh()
				return
			}

			if (result.outcome === "facilityMismatch") {
				setMismatch({ otherTenantId: result.otherTenantId })
				return
			}

			if (result.outcome === "locked") {
				setLockedUntilMs(result.lockedUntilMs)
				setMismatch(null)
				return
			}

			if (result.outcome === "mismatch") {
				setAttemptsRemaining(result.attemptsRemaining)
				toast.error(
					`Verification failed. ${result.attemptsRemaining} attempt${result.attemptsRemaining !== 1 ? "s" : ""} remaining.`
				)
			}
		} catch {
			toast.error("An error occurred. Please try again.")
		}
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setMismatch(null)
		void submit()
	}

	function handleMismatchConfirm(switchTenantTo: string) {
		setMismatch(null)
		void submit(switchTenantTo)
	}

	const isLocked = lockedUntilMs !== null && lockedUntilMs > Date.now()

	return (
		<>
			<Card className="mx-auto w-full max-w-md">
				<CardHeader>
					<CardTitle>Verify Patient Record</CardTitle>
					<CardDescription>
						Enter your MRN, date of birth, and last name to link your patient record.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLocked && lockedUntilMs && <LockoutBanner lockedUntilMs={lockedUntilMs} />}

					{attemptsRemaining !== null && !isLocked && (
						<p className="text-destructive mb-4 text-sm">
							{attemptsRemaining} attempt{attemptsRemaining !== 1 ? "s" : ""} remaining before
							lockout.
						</p>
					)}

					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<Field data-invalid={!!errors.mrn}>
								<FieldLabel htmlFor="mrn">Medical Record Number (MRN)</FieldLabel>
								<Input
									id="mrn"
									value={values.mrn}
									onChange={e => setValues(v => ({ ...v, mrn: e.target.value }))}
									placeholder="e.g. MRN-001234"
									disabled={isPending || isLocked}
									aria-invalid={!!errors.mrn}
								/>
								{errors.mrn && <FieldError errors={[errors.mrn]} />}
							</Field>

							<Field data-invalid={!!errors.dateOfBirth}>
								<FieldLabel htmlFor="dob">Date of Birth</FieldLabel>
								<Input
									id="dob"
									type="date"
									value={values.dateOfBirth}
									onChange={e => setValues(v => ({ ...v, dateOfBirth: e.target.value }))}
									disabled={isPending || isLocked}
									aria-invalid={!!errors.dateOfBirth}
								/>
								{errors.dateOfBirth && <FieldError errors={[errors.dateOfBirth]} />}
							</Field>

							<Field data-invalid={!!errors.lastName}>
								<FieldLabel htmlFor="lastName">Last Name</FieldLabel>
								<Input
									id="lastName"
									value={values.lastName}
									onChange={e => setValues(v => ({ ...v, lastName: e.target.value }))}
									placeholder="Your last name"
									disabled={isPending || isLocked}
									aria-invalid={!!errors.lastName}
								/>
								{errors.lastName && <FieldError errors={[errors.lastName]} />}
							</Field>

							<Button type="submit" className="w-full" disabled={isPending || isLocked}>
								{isPending ? "Verifying..." : "Verify"}
							</Button>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>

			{mismatch && (
				<FacilityMismatchModal
					open
					otherTenantId={mismatch.otherTenantId}
					onConfirm={handleMismatchConfirm}
					onCancel={() => setMismatch(null)}
				/>
			)}
		</>
	)
}
