"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/core/components/ui/button"
import { ExternalLink } from "@/core/components/icons"

interface PopOutToggleProps {
	caseRef: string
}

export function PopOutToggle({ caseRef }: PopOutToggleProps) {
	const router = useRouter()

	return (
		<Button
			variant="ghost"
			size="icon-sm"
			onClick={() => router.push(`/staff/cases/${caseRef}`)}
			title="Open in full page"
		>
			<ExternalLink />
			<span className="sr-only">Open full page</span>
		</Button>
	)
}
