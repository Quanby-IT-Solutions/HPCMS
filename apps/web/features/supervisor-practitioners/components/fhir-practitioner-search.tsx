"use client"

import { useState } from "react"

import { Input } from "@/core/components/ui/input"
import { usePractitionerListQuery } from "@/features/supervisor-practitioners/api/practitioners.hooks"

type PractitionerOption =
	| { type: "practitioner"; id: string; name: string; specialty?: string | null; licenseNo?: string | null }
	| { type: "freeText"; text: string }

interface Props {
	onSelect: (value: PractitionerOption) => void
	placeholder?: string
}

export function FhirPractitionerSearch({ onSelect, placeholder = "Search practitioners…" }: Props) {
	const [q, setQ] = useState("")
	const [open, setOpen] = useState(false)
	const { data: practitioners } = usePractitionerListQuery({ query: q })

	const filtered = (practitioners ?? []).filter(p =>
		p.fullName.toLowerCase().includes(q.toLowerCase())
	)

	return (
		<div className="relative">
			<Input
				value={q}
				onChange={e => {
					setQ(e.target.value)
					setOpen(true)
				}}
				onFocus={() => setOpen(true)}
				onBlur={() => setTimeout(() => setOpen(false), 150)}
				placeholder={placeholder}
			/>
			{open && q.length > 0 ? (
				<div className="bg-popover border-border absolute z-50 mt-1 w-full rounded-md border shadow-md">
					{filtered.length > 0 ? (
						filtered.map(p => (
							<button
								key={p.id}
								type="button"
								className="hover:bg-accent flex w-full flex-col px-3 py-2 text-left"
								onMouseDown={() => {
									onSelect({ type: "practitioner", id: p.id, name: p.fullName, specialty: p.specialty, licenseNo: p.licenseNo })
									setQ(p.fullName)
									setOpen(false)
								}}
							>
								<span className="text-sm font-medium">{p.fullName}</span>
								{p.specialty ? <span className="text-muted-foreground text-xs">{p.specialty} · {p.licenseNo}</span> : null}
							</button>
						))
					) : null}
					<button
						type="button"
						className="hover:bg-accent text-muted-foreground w-full px-3 py-2 text-left text-xs italic"
						onMouseDown={() => {
							onSelect({ type: "freeText", text: q })
							setOpen(false)
						}}
					>
						Use &ldquo;{q}&rdquo; as free text
					</button>
				</div>
			) : null}
		</div>
	)
}
