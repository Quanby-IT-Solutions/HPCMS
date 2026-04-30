import { Alert, AlertDescription, AlertTitle } from "@/core/components/ui/alert"
import { AlertTriangle, CheckCircle, AlertCircle } from "@/core/components/icons"

type PortalAlertVariant = "info" | "success" | "warning" | "error"

interface PortalAlertProps {
	title?: string
	description: React.ReactNode
	variant?: PortalAlertVariant
}

const ICONS: Record<PortalAlertVariant, React.ReactNode> = {
	info: <AlertCircle className="size-4" />,
	success: <CheckCircle className="size-4" />,
	warning: <AlertTriangle className="size-4" />,
	error: <AlertCircle className="size-4" />,
}

export function PortalAlert({ title, description, variant = "info" }: PortalAlertProps) {
	return (
		<Alert variant={variant === "error" ? "destructive" : "default"}>
			{title ? (
				<AlertTitle className="flex items-center gap-2">
					{ICONS[variant]}
					{title}
				</AlertTitle>
			) : null}
			<AlertDescription>{description}</AlertDescription>
		</Alert>
	)
}
