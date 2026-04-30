"use client"

import { X } from "@/core/components/icons"
import { cn } from "@/core/lib/utils"

export interface FilterChipOption {
	value: string
	label: string
}

interface FilterChipBarProps {
	chips: Array<{ key: string; label: string; options: FilterChipOption[] }>
	selected: Record<string, string | undefined>
	onChange: (key: string, value: string | undefined) => void
	className?: string
}

export function FilterChipBar({ chips, selected, onChange, className }: FilterChipBarProps) {
	const activeCount = Object.values(selected).filter(Boolean).length

	return (
		<div className={cn("flex flex-wrap items-center gap-2", className)}>
			{chips.map(chip => {
				const value = selected[chip.key]
				const activeOption = value ? chip.options.find(o => o.value === value) : null
				return (
					<div key={chip.key} className="relative">
						<select
							value={value ?? ""}
							onChange={e => onChange(chip.key, e.target.value || undefined)}
							className={cn(
								"appearance-none rounded-full border px-3 py-1 pr-7 text-xs font-medium transition-colors",
								activeOption
									? "border-primary/50 bg-primary/10 text-primary"
									: "border-border bg-card text-muted-foreground hover:bg-muted"
							)}
						>
							<option value="">{chip.label}</option>
							{chip.options.map(opt => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
						{activeOption ? (
							<button
								type="button"
								onClick={() => onChange(chip.key, undefined)}
								className="text-primary absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-0.5 hover:bg-black/10"
								aria-label={`Clear ${chip.label}`}
							>
								<X className="size-3" />
							</button>
						) : null}
					</div>
				)
			})}
			{activeCount > 0 ? (
				<button
					type="button"
					onClick={() => chips.forEach(c => onChange(c.key, undefined))}
					className="text-muted-foreground hover:text-foreground text-xs underline-offset-2 hover:underline"
				>
					Clear all
				</button>
			) : null}
		</div>
	)
}
