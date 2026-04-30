import Link from "next/link"

import { CheckCircle } from "@/core/components/icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card"

interface Props {
	params: Promise<{ caseId: string }>
}

export default async function LoaConfirmationPage({ params }: Props) {
	const { caseId } = await params

	return (
		<div className="mx-auto flex max-w-2xl flex-col gap-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg">
						<CheckCircle className="text-primary size-5" />
						LOA request submitted
					</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-4 text-sm">
					<p>
						Your case reference is{" "}
						<code className="bg-muted rounded px-1 py-0.5 font-mono">{caseId}</code>.
					</p>
					<p className="text-muted-foreground">
						We&apos;ve emailed a copy of your submission to your registered email
						address. Our coordinators will review your request and update you on the
						portal as the status changes.
					</p>
					<div className="flex flex-wrap items-center gap-2 pt-2">
						<Link
							href={`/portal/requests/${caseId}`}
							className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium"
						>
							Track status
						</Link>
						<Link
							href="/portal/dashboard"
							className="border-border hover:bg-muted inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium"
						>
							Back to dashboard
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
