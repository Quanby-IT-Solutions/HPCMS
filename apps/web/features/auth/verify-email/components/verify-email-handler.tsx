"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"

import { Button, buttonVariants } from "@/core/components/ui/button"
import { Card, CardContent } from "@/core/components/ui/card"
import { Input } from "@/core/components/ui/input"
import { cn } from "@/core/lib/utils"
import { sessionKeys } from "@/features/auth/api/session.hooks"
import { authClient } from "@/services/better-auth/auth-client"

type VerifyState = "verifying" | "error" | "no-token"
type ResendState = "idle" | "sending" | "sent" | "error"

interface VerifyEmailHandlerProps {
	token: string | undefined
}

export function VerifyEmailHandler({ token }: VerifyEmailHandlerProps) {
	const [verifyState, setVerifyState] = useState<VerifyState>(token ? "verifying" : "no-token")
	const [errorMessage, setErrorMessage] = useState("")
	const [resendEmail, setResendEmail] = useState("")
	const [resendState, setResendState] = useState<ResendState>("idle")
	const [resendError, setResendError] = useState("")
	const router = useRouter()
	const queryClient = useQueryClient()

	useEffect(() => {
		if (!token) return

		authClient
			.verifyEmail({ query: { token } })
			.then(result => {
				if (result.error) {
					setErrorMessage(result.error.message ?? "Email verification failed.")
					setVerifyState("error")
				} else {
					queryClient.invalidateQueries({ queryKey: sessionKeys.all })
					router.push("/portal/my-requests")
				}
			})
			.catch(() => {
				setErrorMessage("An unexpected error occurred during verification.")
				setVerifyState("error")
			})
	}, [token, router, queryClient])

	async function handleResend(e: React.FormEvent) {
		e.preventDefault()
		if (!resendEmail) return
		setResendState("sending")
		setResendError("")
		try {
			const result = await authClient.sendVerificationEmail({
				email: resendEmail,
				callbackURL: `${window.location.origin}/verify-email`,
			})
			if (result.error) {
				setResendError(result.error.message ?? "Failed to resend. Try again.")
				setResendState("error")
			} else {
				setResendState("sent")
			}
		} catch {
			setResendError("An unexpected error occurred.")
			setResendState("error")
		}
	}

	return (
		<Card className="overflow-hidden">
			<CardContent className="p-6 md:p-8">
				{verifyState === "verifying" && (
					<div className="flex flex-col items-center gap-4 text-center">
						<div className="border-primary size-10 animate-spin rounded-full border-4 border-t-transparent" />
						<p className="text-muted-foreground">Verifying your email address...</p>
					</div>
				)}

				{(verifyState === "error" || verifyState === "no-token") && (
					<div className="flex flex-col gap-6">
						<div className="flex flex-col items-center gap-2 text-center">
							<div className="flex size-14 items-center justify-center rounded-full bg-red-100 text-2xl dark:bg-red-900">
								✕
							</div>
							<h1 className="text-2xl font-bold">Verification failed</h1>
							<p className="text-muted-foreground">
								{verifyState === "no-token"
									? "No verification token found. Please check the link in your email."
									: errorMessage || "The verification link may have expired or already been used."}
							</p>
						</div>

						{resendState === "sent" ? (
							<p className="text-center text-sm text-green-600 dark:text-green-400">
								New verification email sent. Check your inbox.
							</p>
						) : (
							<form onSubmit={handleResend} className="flex flex-col gap-3">
								<p className="text-muted-foreground text-center text-sm">
									Request a new verification link
								</p>
								<div className="flex gap-2">
									<Input
										type="email"
										placeholder="your@email.com"
										value={resendEmail}
										onChange={e => setResendEmail(e.target.value)}
										disabled={resendState === "sending"}
										required
									/>
									<Button
										type="submit"
										variant="outline"
										disabled={resendState === "sending" || !resendEmail}
									>
										{resendState === "sending" ? "Sending..." : "Resend"}
									</Button>
								</div>
								{resendState === "error" && (
									<p className="text-destructive text-sm">{resendError}</p>
								)}
							</form>
						)}

						<Link
							href="/login"
							className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
						>
							Back to sign in
						</Link>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
