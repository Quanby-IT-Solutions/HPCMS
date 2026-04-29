"use client"

import { useState } from "react"
import Link from "next/link"

import { Button, buttonVariants } from "@/core/components/ui/button"
import { Card, CardContent } from "@/core/components/ui/card"
import { Input } from "@/core/components/ui/input"
import { cn } from "@/core/lib/utils"
import { authClient } from "@/services/better-auth/auth-client"

type ResendState = "idle" | "sending" | "sent" | "error"

export function CheckEmailScreen() {
	const [email, setEmail] = useState("")
	const [resendState, setResendState] = useState<ResendState>("idle")
	const [resendError, setResendError] = useState("")

	async function handleResend(e: React.FormEvent) {
		e.preventDefault()
		if (!email) return
		setResendState("sending")
		setResendError("")
		try {
			const result = await authClient.sendVerificationEmail({
				email,
				callbackURL: `${window.location.origin}/verify-email`,
			})
			if (result.error) {
				setResendError(result.error.message ?? "Failed to resend. Try again.")
				setResendState("error")
			} else {
				setResendState("sent")
			}
		} catch {
			setResendError("An unexpected error occurred. Try again.")
			setResendState("error")
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<Card className="overflow-hidden">
				<CardContent className="p-6 md:p-8">
					<div className="flex flex-col gap-6">
						<div className="flex flex-col items-center gap-2 text-center">
							<div className="bg-primary/10 flex size-14 items-center justify-center rounded-full text-2xl">
								✉️
							</div>
							<h1 className="text-2xl font-bold">Check your email</h1>
							<p className="text-muted-foreground text-balance">
								We sent a verification link to your email address. Click the link to activate your
								account.
							</p>
						</div>

						<div className="bg-muted rounded-lg p-4 text-sm">
							<p className="font-medium">Didn&apos;t receive the email?</p>
							<ul className="text-muted-foreground mt-1 list-inside list-disc space-y-1">
								<li>Check your spam or junk folder</li>
								<li>Make sure you entered the correct email</li>
							</ul>
						</div>

						{resendState === "sent" ? (
							<p className="text-center text-sm text-green-600 dark:text-green-400">
								Verification email resent. Check your inbox.
							</p>
						) : (
							<form onSubmit={handleResend} className="flex flex-col gap-3">
								<p className="text-muted-foreground text-center text-sm">Resend verification email</p>
								<div className="flex gap-2">
									<Input
										type="email"
										placeholder="your@email.com"
										value={email}
										onChange={e => setEmail(e.target.value)}
										disabled={resendState === "sending"}
										required
									/>
									<Button
										type="submit"
										variant="outline"
										disabled={resendState === "sending" || !email}
									>
										{resendState === "sending" ? "Sending..." : "Resend"}
									</Button>
								</div>
								{(resendState === "error") && (
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
				</CardContent>
			</Card>
		</div>
	)
}
