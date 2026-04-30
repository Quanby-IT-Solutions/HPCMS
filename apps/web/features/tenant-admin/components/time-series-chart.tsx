"use client"

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface LineConfig {
	key: string
	label: string
	color: string
}

interface TimeSeriesChartProps {
	data: Record<string, unknown>[]
	lines: LineConfig[]
	height?: number
	xKey?: string
	chartType?: "area" | "bar"
}

export function TimeSeriesChart({ data, lines, height = 300, xKey = "date", chartType = "area" }: TimeSeriesChartProps) {
	if (chartType === "bar") {
		return (
			<ResponsiveContainer width="100%" height={height}>
				<BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
					<CartesianGrid strokeDasharray="3 3" className="stroke-border" />
					<XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
					<YAxis tick={{ fontSize: 12 }} />
					<Tooltip />
					<Legend />
					{lines.map(line => (
						<Bar
							key={line.key}
							dataKey={line.key}
							name={line.label}
							fill={line.color}
						/>
					))}
				</BarChart>
			</ResponsiveContainer>
		)
	}

	return (
		<ResponsiveContainer width="100%" height={height}>
			<AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
				<CartesianGrid strokeDasharray="3 3" className="stroke-border" />
				<XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
				<YAxis tick={{ fontSize: 12 }} />
				<Tooltip />
				<Legend />
				{lines.map(line => (
					<Area
						key={line.key}
						type="monotone"
						dataKey={line.key}
						name={line.label}
						stroke={line.color}
						fill={line.color}
						fillOpacity={0.1}
						strokeWidth={2}
					/>
				))}
			</AreaChart>
		</ResponsiveContainer>
	)
}
