"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { Card, CardContent } from "@/core/components/ui/card"

export default function PasswordResetVerifyPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const token = searchParams.get("token")

	React.useEffect(() => {
		if (token && token.trim() !== "") {
			const timer = setTimeout(() => {
				router.push(`/password-reset/new?token=${encodeURIComponent(token)}`)
			}, 1000)
			return () => clearTimeout(timer)
		}
	}, [token, router])

	if (!token || token.trim() === "") {
		return (
			<section className="flex flex-1 flex-col items-center justify-center">
				<Card className="w-full max-w-sm overflow-hidden p-0">
					<CardContent className="flex flex-col items-center gap-4 p-6 text-center md:p-8">
						<div className="bg-destructive/10 flex size-12 items-center justify-center rounded-full">
							<span className="text-destructive text-xl">!</span>
						</div>
						<div className="flex flex-col gap-1">
							<h1 className="text-xl font-bold">Invalid or expired link</h1>
							<p className="text-muted-foreground text-sm">
								This link is invalid or has expired. Please request a new one.
							</p>
						</div>
						<Link
							href="/password-reset"
							className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-8 w-full items-center justify-center rounded-lg px-2.5 text-sm font-medium transition-colors"
						>
							Request a new link
						</Link>
					</CardContent>
				</Card>
			</section>
		)
	}

	return (
		<section className="flex flex-1 flex-col items-center justify-center">
			<Card className="w-full max-w-sm overflow-hidden p-0">
				<CardContent className="flex flex-col items-center gap-4 p-6 text-center md:p-8">
					<div className="border-primary/20 border-t-primary size-10 animate-spin rounded-full border-4" />
					<div className="flex flex-col gap-1">
						<h1 className="text-xl font-bold">Verifying your identity...</h1>
						<p className="text-muted-foreground text-sm">
							Identity verified. Redirecting...
						</p>
					</div>
				</CardContent>
			</Card>
		</section>
	)
}
