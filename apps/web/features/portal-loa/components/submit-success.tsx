"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle } from "@/core/components/icons"

import { buttonVariants } from "@/core/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card"
import { cn } from "@/core/lib/utils"

interface SubmitSuccessProps {
	caseRef: string
}

export function SubmitSuccess({ caseRef }: SubmitSuccessProps) {
	const router = useRouter()

	useEffect(() => {
		const timer = setTimeout(() => {
			router.push("/portal/my-requests")
		}, 5000)
		return () => clearTimeout(timer)
	}, [router])

	return (
		<Card className="mx-auto max-w-md text-center">
			<CardHeader>
				<div className="flex justify-center">
					<CheckCircle className="text-primary size-12" />
				</div>
				<CardTitle className="text-xl">Request Submitted</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<p className="text-muted-foreground text-sm">
					Your LOA request has been submitted successfully. Your case reference is:
				</p>
				<p className="text-primary text-2xl font-bold tracking-wide">{caseRef}</p>
				<p className="text-muted-foreground text-xs">
					You will be redirected to My Requests in 5 seconds.
				</p>
				<div className="flex justify-center gap-3">
					<Link href={`/portal/my-requests/${caseRef}`} className={cn(buttonVariants())}>
						View Request
					</Link>
					<Link href="/portal/my-requests" className={cn(buttonVariants({ variant: "outline" }))}>
						Back to My Requests
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
