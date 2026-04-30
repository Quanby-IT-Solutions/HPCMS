"use client"

import { cn } from "@/core/lib/utils"

interface PortalFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
	children: React.ReactNode
	className?: string
}

/**
 * Patient-portal form primitive: large readable spacing, generous gaps, and
 * an accessible noValidate form (we run our own field-level validation).
 */
export function PortalForm({ children, className, ...props }: PortalFormProps) {
	return (
		<form noValidate className={cn("flex flex-col gap-5", className)} {...props}>
			{children}
		</form>
	)
}
