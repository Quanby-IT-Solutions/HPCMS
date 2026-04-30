"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import type { CodeRow, CodeSystemSchema } from "@repo/contracts"
import type { z } from "zod"

import { Input } from "@/core/components/ui/input"
import { Skeleton } from "@/core/components/ui/skeleton"
import { orpc } from "@/services/orpc/client"

type CodeSystem = z.infer<typeof CodeSystemSchema>

const MOCK: Record<CodeSystem, CodeRow[]> = {
	icd10: [
		{ system: "icd10", code: "E11.9", display: "Type 2 diabetes without complications", category: "endocrine" },
		{ system: "icd10", code: "I10", display: "Essential (primary) hypertension", category: "circulatory" },
	],
	phic_cpt: [
		{ system: "phic_cpt", code: "99213", display: "Office visit, established patient · level 3", category: "evaluation" },
		{ system: "phic_cpt", code: "82947", display: "Glucose, quantitative blood", category: "lab" },
	],
	loinc: [],
	ndc: [],
	internal: [],
}

interface Props {
	system: CodeSystem
	value: string
	onChange: (code: string, description: string) => void
}

export function CodeLookupPopover({ system, value, onChange }: Props) {
	const [open, setOpen] = useState(false)

	const { data, isLoading } = useQuery({
		...orpc.codes.lookup.queryOptions({ input: { system, q: value || "_", limit: 10 } }),
		enabled: open && (value.length > 0 || true),
		placeholderData: { rows: MOCK[system] ?? [] },
	})

	return (
		<div className="relative">
			<Input
				value={value}
				onChange={e => {
					onChange(e.target.value, "")
					setOpen(true)
				}}
				onFocus={() => setOpen(true)}
				onBlur={() => setTimeout(() => setOpen(false), 150)}
				placeholder="Lookup…"
			/>
			{open ? (
				<div className="bg-popover absolute z-10 mt-1 max-h-56 w-72 overflow-y-auto rounded-md border p-1 shadow-md">
					{isLoading ? (
						<Skeleton className="h-12 w-full" />
					) : (data?.rows.length ?? 0) === 0 ? (
						<p className="text-muted-foreground p-2 text-xs italic">No matches.</p>
					) : (
						(data?.rows ?? []).map(r => (
							<button
								key={r.code}
								type="button"
								onMouseDown={() => {
									onChange(r.code, r.display)
									setOpen(false)
								}}
								className="hover:bg-muted flex w-full flex-col items-start rounded-md p-2 text-left text-xs"
							>
								<span className="font-mono font-semibold">{r.code}</span>
								<span className="text-muted-foreground">{r.display}</span>
							</button>
						))
					)}
				</div>
			) : null}
		</div>
	)
}
