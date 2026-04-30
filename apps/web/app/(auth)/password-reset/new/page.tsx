"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
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
import { PasswordInput } from "@/features/auth/components/password-input"

interface PasswordErrors {
	newPassword?: string
	confirmPassword?: string
}

function validatePassword(password: string): string | null {
	if (password.length < 12) return "Password must be at least 12 characters"
	if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter"
	if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter"
	if (!/\d/.test(password)) return "Password must contain at least one digit"
	if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain at least one symbol"
	return null
}

export default function PasswordResetNewPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const token = searchParams.get("token")

	const [newPassword, setNewPassword] = React.useState("")
	const [confirmPassword, setConfirmPassword] = React.useState("")
	const [fieldErrors, setFieldErrors] = React.useState<PasswordErrors>({})
	const [success, setSuccess] = React.useState(false)

	React.useEffect(() => {
		if (!token) {
			router.replace("/password-reset")
		}
	}, [token, router])

	const { mutate, isPending, isError, error } = useMutation({
		mutationFn: async ({ password, tok }: { password: string; tok: string }) => {
			const result = await authClient.resetPassword({
				newPassword: password,
				token: tok,
			})
			if (result.error) {
				throw new Error(result.error.message || "Failed to reset password")
			}
			return result
		},
		onSuccess: () => {
			setSuccess(true)
			setTimeout(() => {
				router.push("/login")
			}, 2000)
		},
	})

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		const errors: PasswordErrors = {}

		const passwordError = validatePassword(newPassword)
		if (passwordError) {
			errors.newPassword = passwordError
		}

		if (!confirmPassword) {
			errors.confirmPassword = "Please confirm your password"
		} else if (newPassword !== confirmPassword) {
			errors.confirmPassword = "Passwords do not match"
		}

		if (Object.keys(errors).length > 0) {
			setFieldErrors(errors)
			return
		}

		setFieldErrors({})
		if (token) {
			mutate({ password: newPassword, tok: token })
		}
	}

	if (!token) {
		return null
	}

	if (success) {
		return (
			<section className="flex flex-1 flex-col items-center justify-center">
				<Card className="w-full max-w-sm overflow-hidden p-0">
					<CardContent className="flex flex-col items-center gap-4 p-6 text-center md:p-8">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-full">
							<span className="text-primary text-xl">✓</span>
						</div>
						<div className="flex flex-col gap-1">
							<h1 className="text-xl font-bold">Password reset successfully</h1>
							<p className="text-muted-foreground text-sm">
								Your password has been reset. Redirecting to login...
							</p>
						</div>
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
								<h1 className="text-2xl font-bold">Set new password</h1>
								<p className="text-muted-foreground text-balance">
									Create a strong password for your account.
								</p>
							</div>

							{isError && (
								<div className="bg-destructive/10 text-destructive dark:bg-destructive/20 rounded-lg p-3 text-sm">
									{error instanceof Error ? error.message : "An unexpected error occurred"}
								</div>
							)}

							<Field data-invalid={!!fieldErrors.newPassword}>
								<FieldLabel htmlFor="new-password">New Password</FieldLabel>
								<PasswordInput
									id="new-password"
									name="newPassword"
									value={newPassword}
									onChange={e => {
										setNewPassword(e.target.value)
										if (fieldErrors.newPassword)
											setFieldErrors(prev => ({ ...prev, newPassword: undefined }))
									}}
									autoComplete="new-password"
									disabled={isPending}
									aria-invalid={!!fieldErrors.newPassword}
								/>
								{fieldErrors.newPassword && (
									<FieldError>{fieldErrors.newPassword}</FieldError>
								)}
								<FieldDescription>
									Min 12 characters, upper, lower, digit, symbol
								</FieldDescription>
							</Field>

							<Field data-invalid={!!fieldErrors.confirmPassword}>
								<FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
								<PasswordInput
									id="confirm-password"
									name="confirmPassword"
									value={confirmPassword}
									onChange={e => {
										setConfirmPassword(e.target.value)
										if (fieldErrors.confirmPassword)
											setFieldErrors(prev => ({ ...prev, confirmPassword: undefined }))
									}}
									autoComplete="new-password"
									disabled={isPending}
									aria-invalid={!!fieldErrors.confirmPassword}
								/>
								{fieldErrors.confirmPassword && (
									<FieldError>{fieldErrors.confirmPassword}</FieldError>
								)}
							</Field>

							<Field>
								<Button type="submit" disabled={isPending} className="w-full hover:cursor-pointer">
									{isPending ? "Resetting..." : "Reset Password"}
								</Button>
							</Field>

							<FieldDescription className="text-center">
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
