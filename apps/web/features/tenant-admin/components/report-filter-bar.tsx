"use client"

import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"

interface FilterSlot {
	key: string
	label: string
	type: "text" | "date" | "select"
	options?: { value: string; label: string }[]
	value: string
	onChange: (value: string) => void
}

interface ReportFilterBarProps {
	filters: FilterSlot[]
	onApply: () => void
	onReset: () => void
}

export function ReportFilterBar({ filters, onApply, onReset }: ReportFilterBarProps) {
	return (
		<div className="rounded-lg border bg-muted/20 p-4">
			<div className="flex flex-wrap items-end gap-4">
				{filters.map(filter => (
					<div key={filter.key} className="flex flex-col gap-1 min-w-36">
						<Label className="text-xs text-muted-foreground">{filter.label}</Label>
						{filter.type === "select" ? (
							<select
								value={filter.value}
								onChange={e => filter.onChange(e.target.value)}
								className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
							>
								<option value="">All</option>
								{filter.options?.map(opt => (
									<option key={opt.value} value={opt.value}>{opt.label}</option>
								))}
							</select>
						) : (
							<Input
								type={filter.type}
								value={filter.value}
								onChange={e => filter.onChange(e.target.value)}
								className="h-9"
							/>
						)}
					</div>
				))}
				<div className="flex gap-2 pb-0.5">
					<Button variant="outline" size="sm" onClick={onReset} type="button">Reset</Button>
					<Button size="sm" onClick={onApply} type="button">Apply</Button>
				</div>
			</div>
		</div>
	)
}
