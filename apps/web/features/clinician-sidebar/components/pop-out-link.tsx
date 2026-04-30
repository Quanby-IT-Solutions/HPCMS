import { ExternalLink } from "@/core/components/icons"
import { cn } from "@/core/lib/utils"
import { env } from "@/env"

interface PopOutLinkProps {
	to: string
	caseRef?: string
	patientId?: string
	children: React.ReactNode
	className?: string
}

export function PopOutLink({ to, caseRef, patientId, children, className }: PopOutLinkProps) {
	const base = (env.NEXT_PUBLIC_APP_URL || "http://localhost:3001").replace(/\/$/, "")
	const url = new URL(to, base)
	if (caseRef) url.searchParams.set("caseRef", caseRef)
	if (patientId) url.searchParams.set("patientId", patientId)

	return (
		<a
			href={url.toString()}
			target="_blank"
			rel="noopener noreferrer"
			className={cn(
				"text-primary inline-flex items-center gap-1 text-xs font-medium hover:underline",
				className
			)}
		>
			<span>{children}</span>
			<ExternalLink className="size-3" />
		</a>
	)
}
