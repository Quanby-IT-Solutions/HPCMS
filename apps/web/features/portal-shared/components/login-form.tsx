"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { authClient } from "@/services/better-auth/auth-client"
import { PortalField } from "@/features/portal-shared/components/portal-field"
import { PortalForm } from "@/features/portal-shared/components/portal-form"

export function PortalLoginForm() {
	const router = useRouter()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState<string | null>(null)
	const [isPending, setIsPending] = useState(false)

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError(null)
		setIsPending(true)
		try {
			await authClient.signIn.email({
				email,
				password,
			})
			toast.success("Signed in")
			router.push("/portal/dashboard")
		} catch (err) {
			setError("Email or password is incorrect.")
			toast.error("Sign-in failed", { description: (err as Error).message })
		} finally {
			setIsPending(false)
		}
	}

	return (
		<PortalForm onSubmit={handleSubmit}>
			<PortalField label="Email" htmlFor="login-email" required>
				<Input
					id="login-email"
					type="email"
					value={email}
					onChange={e => setEmail(e.target.value)}
					autoComplete="email"
				/>
			</PortalField>
			<PortalField label="Password" htmlFor="login-password" required error={error}>
				<Input
					id="login-password"
					type="password"
					value={password}
					onChange={e => setPassword(e.target.value)}
					autoComplete="current-password"
				/>
			</PortalField>
			<Button type="submit" disabled={isPending} className="w-fit">
				{isPending ? "Signing in…" : "Sign in"}
			</Button>
		</PortalForm>
	)
}
