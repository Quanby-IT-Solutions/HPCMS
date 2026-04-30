"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { PortalAlert } from "@/features/portal-shared/components/portal-alert"
import { PortalField } from "@/features/portal-shared/components/portal-field"
import { PortalForm } from "@/features/portal-shared/components/portal-form"

const CODE_TTL_SECONDS = 5 * 60
const RESEND_AFTER_SECONDS = 30

export default function MfaPage() {
	const router = useRouter()
	const [code, setCode] = useState("")
	const [issuedAt, setIssuedAt] = useState<number | null>(null)
	const [now, setNow] = useState<number | null>(null)
	const [isPending, setIsPending] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const t0 = setTimeout(() => {
			setIssuedAt(Date.now())
			setNow(Date.now())
		}, 0)
		const tick = setInterval(() => setNow(Date.now()), 1_000)
		return () => {
			clearTimeout(t0)
			clearInterval(tick)
		}
	}, [])

	const elapsed = issuedAt && now ? Math.floor((now - issuedAt) / 1000) : 0
	const remaining = Math.max(0, CODE_TTL_SECONDS - elapsed)
	const canResend = elapsed >= RESEND_AFTER_SECONDS
	const expired = remaining <= 0

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (expired || code.trim().length < 4) return
		setIsPending(true)
		setError(null)
		try {
			// Stub: backend wires patientPortal.mfa.verify here.
			await new Promise(r => setTimeout(r, 400))
			toast.success("MFA verified")
			router.push("/portal/dashboard")
		} catch (err) {
			setError("Code is invalid or expired.")
			toast.error("MFA failed", { description: (err as Error).message })
		} finally {
			setIsPending(false)
		}
	}

	function resend() {
		setIssuedAt(Date.now())
		setCode("")
		setError(null)
		toast.success("New code sent")
	}

	const minutes = Math.floor(remaining / 60)
	const seconds = remaining % 60

	return (
		<div className="mx-auto flex max-w-md flex-col gap-6">
			<header>
				<h1 className="text-2xl font-bold">Two-step verification</h1>
				<p className="text-muted-foreground mt-1 text-sm">
					Enter the 6-digit code we sent to your registered email or phone.
				</p>
			</header>

			{expired ? (
				<PortalAlert
					variant="warning"
					title="Code expired"
					description="The code is no longer valid. Request a new one to continue."
				/>
			) : null}

			<PortalForm onSubmit={handleSubmit}>
				<PortalField
					label="Verification code"
					htmlFor="mfa-code"
					required
					error={error}
					hint={
						expired
							? undefined
							: `Code expires in ${minutes}:${seconds.toString().padStart(2, "0")}`
					}
				>
					<Input
						id="mfa-code"
						value={code}
						onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
						inputMode="numeric"
						autoComplete="one-time-code"
						disabled={expired}
					/>
				</PortalField>
				<div className="flex items-center gap-2">
					<Button
						type="submit"
						disabled={expired || isPending || code.length < 4}
					>
						{isPending ? "Verifying…" : "Verify"}
					</Button>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={resend}
						disabled={!canResend && !expired}
					>
						{canResend || expired
							? "Resend code"
							: `Resend in ${RESEND_AFTER_SECONDS - elapsed}s`}
					</Button>
				</div>
			</PortalForm>
		</div>
	)
}
