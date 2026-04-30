import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card"
import { cn } from "@/core/lib/utils"

interface KpiCardProps {
	label: string
	value: string | number
	delta?: number
	icon?: React.ReactNode
	className?: string
	sparklineData?: number[]
}

export function KpiCard({ label, value, delta, icon, className, sparklineData }: KpiCardProps) {
	return (
		<Card className={cn("", className)}>
			<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
				<CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
				{icon && <span className="text-muted-foreground">{icon}</span>}
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				{delta !== undefined && (
					<p className={cn("text-xs mt-1", delta >= 0 ? "text-green-600" : "text-red-600")}>
						{delta >= 0 ? "+" : ""}{delta}% from last period
					</p>
				)}
				{sparklineData && sparklineData.length > 1 && (
					<svg viewBox={`0 0 ${sparklineData.length * 10} 30`} className="w-full h-8 mt-1 opacity-60">
						<polyline
							points={sparklineData.map((v, i) => {
								const max = Math.max(...sparklineData)
								const min = Math.min(...sparklineData)
								const range = max - min || 1
								const x = i * 10
								const y = 30 - ((v - min) / range) * 28
								return `${x},${y}`
							}).join(" ")}
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						/>
					</svg>
				)}
			</CardContent>
		</Card>
	)
}
