import type { RiskLevel } from "@repo/contracts"

import { Badge } from "@/core/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/core/components/ui/tooltip"

const VARIANT: Record<RiskLevel, "default" | "secondary" | "destructive" | "outline"> = {
	low: "outline",
	moderate: "secondary",
	high: "default",
	critical: "destructive",
}

const LABEL: Record<RiskLevel, string> = {
	low: "Low",
	moderate: "Moderate",
	high: "High",
	critical: "Critical",
}

interface RiskBadgeProps {
	level: RiskLevel | null
	lastUpdatedAt?: string | null
}

export function RiskBadge({ level, lastUpdatedAt }: RiskBadgeProps) {
	if (!level) return <span className="text-muted-foreground text-xs">—</span>
	const tooltipText = `Risk factors: case age, unanswered communications, SLA proximity, complaint keywords${lastUpdatedAt ? `\nUpdated: ${new Date(lastUpdatedAt).toLocaleString()}` : ""}`
	return (
		<Tooltip>
			<TooltipTrigger>
				<Badge
					variant={VARIANT[level]}
					title={tooltipText}
				>
					{LABEL[level]}
				</Badge>
			</TooltipTrigger>
			<TooltipContent className="max-w-52 text-[10px]">
				<strong>Risk factors:</strong> case age, unanswered communications, SLA proximity, complaint keywords
				{lastUpdatedAt && <><br />Updated: {new Date(lastUpdatedAt).toLocaleString()}</>}
			</TooltipContent>
		</Tooltip>
	)
}
