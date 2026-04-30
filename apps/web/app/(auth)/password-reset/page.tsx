"use client"

import * as React from "react"
import Link from "next/link"
import { useMutation } from "@tanstack/react-query"

import { authClient } from "@/services/better-auth/auth-client"
import { Button } from "@/core/components/ui/button"
import { Card, CardContent } from "@/core/components/ui/card"
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/core/components/ui/field"
import { Input } from "@/core/components/ui/input"
import { cn } from "@/core/lib/utils"

function isValidEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function PasswordResetPage() {
	const [email, setEmail] = React.useState("")
	const [emailError, setEmailError] = React.useState("")
	const [success, setSuccess] = React.useState(false)

	const { mutate, isPending, isError, error } = useMutation({
		mutationFn: async (emailValue: string) => {
			const result = await authClient.requestPasswordReset({
				email: emailValue,
				redirectTo: "/password-reset/new",
			})
			if (result.error) {
				throw new Error(result.error.message || "Failed to send reset link")
			}
			return result
		},
		onSuccess: () => {
			setSuccess(true)
		},
	})

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setEmailError("")

		if (!email.trim()) {
			setEmailError("Email is required")
			return
		}
		if (!isValidEmail(email)) {
			setEmailError("Please enter a valid email address")
			return
		}

		mutate(email)
	}

	if (success) {
		return (
			<section className="flex flex-1 flex-col items-center justify-center">
				<Card className="w-full max-w-sm overflow-hidden p-0">
					<CardContent className="p-6 md:p-8">
						<FieldGroup>
							<div className="flex flex-col items-center gap-2 text-center">
								<h1 className="text-2xl font-bold">Check your email</h1>
								<p className="text-muted-foreground text-balance">
									We sent a password reset link to <strong>{email}</strong>. Check your inbox and
									follow the link to reset your password.
								</p>
							</div>
							<Link
								href="/login"
								className={cn(
									"text-muted-foreground mt-2 text-center text-sm underline-offset-4 hover:underline"
								)}
							>
								Return to login
							</Link>
						</FieldGroup>
					</CardContent>
				</Card>
			</section>
		)
	}

	return (
		<section className="flex flex-1 flex-col items-center justify-center">
			<Card className="w-full max-w-sm overflow-hidden p-0">
				<CardContent className="p-6 md:p-8">
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<div className="flex flex-col items-center gap-2 text-center">
								<h1 className="text-2xl font-bold">Reset your password</h1>
								<p className="text-muted-foreground text-balance">
									Enter your email address and we&apos;ll send you a link to reset your password.
								</p>
							</div>

							{isError && (
								<div className="bg-destructive/10 text-destructive dark:bg-destructive/20 rounded-lg p-3 text-sm">
									{error instanceof Error ? error.message : "An unexpected error occurred"}
								</div>
							)}

							<Field data-invalid={!!emailError}>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									id="email"
									name="email"
									type="email"
									value={email}
									onChange={e => {
										setEmail(e.target.value)
										if (emailError) setEmailError("")
									}}
									placeholder="m@example.com"
									autoComplete="email"
									disabled={isPending}
									aria-invalid={!!emailError}
								/>
								{emailError && (
									<FieldError>
										{emailError}
									</FieldError>
								)}
							</Field>

							<Field>
								<Button type="submit" disabled={isPending} className="w-full hover:cursor-pointer">
									{isPending ? "Sending..." : "Send Reset Link"}
								</Button>
							</Field>

							<FieldDescription className="text-center">
								Remember your password?{" "}
								<Link
									href="/login"
									className="text-foreground underline underline-offset-4 hover:no-underline"
								>
									Return to login
								</Link>
							</FieldDescription>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</section>
	)
}
