"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import { pushRecentSearch } from "@/features/agent-patients/components/recent-searches"

export function PatientSearchForm() {
	const router = useRouter()
	const params = useSearchParams()
	const [query, setQuery] = useState(params.get("q") ?? "")

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		const trimmed = query.trim()
		if (trimmed.length < 2) return
		pushRecentSearch(trimmed)
		const next = new URLSearchParams()
		next.set("q", trimmed)
		router.push(`/agent/patients/results?${next.toString()}`)
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-3">
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="patient-search">
					Search by name, DOB, MRN, contact number, or HMO card
				</Label>
				<Input
					id="patient-search"
					value={query}
					onChange={e => setQuery(e.target.value)}
					placeholder="e.g. Maria Santos, 1971-08-12, PCMS-00421, +63 917 555 1234"
					autoComplete="off"
				/>
				<p className="text-muted-foreground text-[10px]">
					The server matches across all identifier types (CA-BE-02). Combine values with
					spaces.
				</p>
			</div>
			<Button type="submit" disabled={query.trim().length < 2} className="w-fit">
				Search
			</Button>
		</form>
	)
}
