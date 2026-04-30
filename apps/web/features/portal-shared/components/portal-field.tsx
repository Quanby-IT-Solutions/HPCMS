"use client"

import { Label } from "@/core/components/ui/label"
import { cn } from "@/core/lib/utils"

interface PortalFieldProps {
	label: string
	htmlFor: string
	hint?: string
	error?: string | null
	required?: boolean
	className?: string
	children: React.ReactNode
}

export function PortalField({
	label,
	htmlFor,
	hint,
	error,
	required,
	className,
	children,
}: PortalFieldProps) {
	const errorId = error ? `${htmlFor}-error` : undefined
	const hintId = hint ? `${htmlFor}-hint` : undefined
	const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined

	return (
		<div className={cn("flex flex-col gap-1.5", className)}>
			<Label htmlFor={htmlFor} className="text-foreground text-sm">
				{label}
				{required ? <span className="text-destructive ml-0.5">*</span> : null}
			</Label>
			<div data-described-by={describedBy}>{children}</div>
			{hint ? (
				<p id={hintId} className="text-muted-foreground text-xs">
					{hint}
				</p>
			) : null}
			{error ? (
				<p
					id={errorId}
					role="alert"
					aria-live="polite"
					className="text-destructive text-xs"
				>
					{error}
				</p>
			) : null}
		</div>
	)
}
