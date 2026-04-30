"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { PortalAlert } from "@/features/portal-shared/components/portal-alert"
import { PortalField } from "@/features/portal-shared/components/portal-field"
import { PortalForm } from "@/features/portal-shared/components/portal-form"

type Step = "request" | "verify" | "complete" | "expired"

export default function PasswordResetPage() {
	const router = useRouter()
	const [step, setStep] = useState<Step>("request")
	const [email, setEmail] = useState("")
	const [token, setToken] = useState("")
	const [dateOfBirth, setDateOfBirth] = useState("")
	const [otp, setOtp] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [error, setError] = useState<string | null>(null)
	const [isPending, setIsPending] = useState(false)

	async function handleRequest(e: React.FormEvent) {
		e.preventDefault()
		if (!email.trim()) return
		setIsPending(true)
		try {
			// Stub: patientPortal.passwordReset.request
			await new Promise(r => setTimeout(r, 300))
			toast.success("Reset email sent", {
				description: `Check ${email} for a reset link.`,
			})
			setStep("verify")
		} finally {
			setIsPending(false)
		}
	}

	async function handleVerify(e: React.FormEvent) {
		e.preventDefault()
		if (!token.trim() || (!dateOfBirth && !otp)) {
			setError("Provide the token plus DOB or the OTP from your phone.")
			return
		}
		setIsPending(true)
		setError(null)
		try {
			// Stub: patientPortal.passwordReset.verify
			await new Promise(r => setTimeout(r, 300))
			setStep("complete")
		} catch {
			setError("Invalid or expired link.")
			setStep("expired")
		} finally {
			setIsPending(false)
		}
	}

	async function handleComplete(e: React.FormEvent) {
		e.preventDefault()
		if (newPassword.length < 8) {
			setError("Password must be at least 8 characters.")
			return
		}
		setIsPending(true)
		setError(null)
		try {
			// Stub: patientPortal.passwordReset.complete
			await new Promise(r => setTimeout(r, 300))
			toast.success("Password updated", {
				description: "All other sessions have been signed out.",
			})
			router.push("/portal/login")
		} finally {
			setIsPending(false)
		}
	}

	return (
		<div className="mx-auto flex max-w-md flex-col gap-6">
			<header>
				<h1 className="text-2xl font-bold">Reset your password</h1>
				<p className="text-muted-foreground mt-1 text-sm">
					{step === "request"
						? "Enter your account email and we'll send a reset link."
						: step === "verify"
							? "Paste the token from your email and verify your identity."
							: step === "complete"
								? "Choose a new password. All other sessions will be signed out."
								: "This reset link is expired or invalid."}
				</p>
			</header>

			{step === "request" ? (
				<PortalForm onSubmit={handleRequest}>
					<PortalField label="Email" htmlFor="pr-email" required>
						<Input
							id="pr-email"
							type="email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							autoComplete="email"
						/>
					</PortalField>
					<Button type="submit" disabled={isPending} className="w-fit">
						{isPending ? "Sending…" : "Send reset email"}
					</Button>
				</PortalForm>
			) : null}

			{step === "verify" ? (
				<PortalForm onSubmit={handleVerify}>
					<PortalField
						label="Token from email"
						htmlFor="pr-token"
						required
						error={error}
					>
						<Input
							id="pr-token"
							value={token}
							onChange={e => setToken(e.target.value)}
						/>
					</PortalField>
					<PortalField
						label="Date of birth (or use OTP below)"
						htmlFor="pr-dob"
						hint="Either DOB or mobile OTP must match what's on file."
					>
						<Input
							id="pr-dob"
							type="date"
							value={dateOfBirth}
							onChange={e => setDateOfBirth(e.target.value)}
						/>
					</PortalField>
					<PortalField label="Mobile OTP" htmlFor="pr-otp">
						<Input
							id="pr-otp"
							value={otp}
							onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 8))}
							inputMode="numeric"
							placeholder="6-digit code"
						/>
					</PortalField>
					<Button type="submit" disabled={isPending} className="w-fit">
						{isPending ? "Verifying…" : "Verify identity"}
					</Button>
				</PortalForm>
			) : null}

			{step === "complete" ? (
				<PortalForm onSubmit={handleComplete}>
					<PortalField
						label="New password"
						htmlFor="pr-newpw"
						required
						error={error}
						hint="At least 8 characters with an uppercase letter, a digit, and a symbol."
					>
						<Input
							id="pr-newpw"
							type="password"
							value={newPassword}
							onChange={e => setNewPassword(e.target.value)}
							autoComplete="new-password"
						/>
						{newPassword.length > 0 ? (
							<ul className="text-muted-foreground mt-1 list-disc pl-4 text-[11px]">
								{newPassword.length < 8 ? <li>At least 8 characters</li> : null}
								{!/[A-Z]/.test(newPassword) ? (
									<li>Includes an uppercase letter</li>
								) : null}
								{!/[0-9]/.test(newPassword) ? <li>Includes a digit</li> : null}
								{!/[^A-Za-z0-9]/.test(newPassword) ? (
									<li>Includes a symbol</li>
								) : null}
							</ul>
						) : null}
					</PortalField>
					<Button type="submit" disabled={isPending} className="w-fit">
						{isPending ? "Saving…" : "Update password"}
					</Button>
				</PortalForm>
			) : null}

			{step === "expired" ? (
				<PortalAlert
					variant="error"
					title="Reset link expired"
					description="Request a new reset email to continue."
				/>
			) : null}
		</div>
	)
}
