"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { SUPERVISOR_ROUTES } from "@/app/(staff)/supervisor/supervisor-routes"
import { Button } from "@/core/components/ui/button"
import { Checkbox } from "@/core/components/ui/checkbox"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select"
import { Textarea } from "@/core/components/ui/textarea"
import { useIncidentCreateMutation } from "@/features/supervisor-incidents/api/supervisor-incidents.hooks"

const MOCK_CASES = [
	{ ref: "LOA-2026-00128", patientName: "Maria Santos" },
	{ ref: "LOA-2026-00130", patientName: "Ana Reyes" },
	{ ref: "BILL-2026-00043", patientName: "Juan Dela Cruz" },
	{ ref: "BILL-2026-00044", patientName: "Carlos Santos" },
	{ ref: "COMP-2026-00007", patientName: "Maria Lopez" },
]

export function IncidentCreationForm() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [severity, setSeverity] = useState("medium")
	const [selectedCases, setSelectedCases] = useState<string[]>(() => {
		const prefill = searchParams.get("cases")
		if (!prefill) return []
		return prefill.split(",").filter(ref => MOCK_CASES.some(c => c.ref === ref))
	})
	const create = useIncidentCreateMutation()

	function toggleCase(ref: string) {
		setSelectedCases(prev => prev.includes(ref) ? prev.filter(r => r !== ref) : [...prev, ref])
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (selectedCases.length < 2) {
			toast.error("At least 2 cases required")
			return
		}
		try {
			const result = await create.mutateAsync({
				title,
				description,
				severity: severity as "low" | "medium" | "high" | "critical",
				caseRefs: selectedCases,
			})
			toast.success("Incident created")
			router.push(SUPERVISOR_ROUTES.incidentDetail(result.incidentId))
		} catch (err) {
			toast.error("Creation failed", { description: (err as Error).message })
		}
	}

	return (
		<form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
			<header>
				<h1 className="text-2xl font-bold">New Incident</h1>
			</header>
			<div className="flex flex-col gap-1.5">
				<Label>Title *</Label>
				<Input required value={title} onChange={e => setTitle(e.target.value)} maxLength={200} />
			</div>
			<div className="flex flex-col gap-1.5">
				<Label>Description *</Label>
				<Textarea required value={description} onChange={e => setDescription(e.target.value)} rows={4} maxLength={2000} />
			</div>
			<div className="flex flex-col gap-1.5">
				<Label>Severity</Label>
				<Select value={severity} onValueChange={v => v && setSeverity(v)}>
					<SelectTrigger><SelectValue /></SelectTrigger>
					<SelectContent>
						<SelectItem value="low">Low</SelectItem>
						<SelectItem value="medium">Medium</SelectItem>
						<SelectItem value="high">High</SelectItem>
						<SelectItem value="critical">Critical</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className="flex flex-col gap-1.5">
				<Label>Affected cases (minimum 2) *</Label>
				{selectedCases.length < 2 ? (
					<p className="text-destructive text-xs">Select at least 2 cases to create an incident.</p>
				) : null}
				<div className="rounded-md border divide-y max-h-52 overflow-y-auto">
					{MOCK_CASES.map(c => (
						<label key={c.ref} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted/40">
							<Checkbox checked={selectedCases.includes(c.ref)} onCheckedChange={() => toggleCase(c.ref)} />
							<span className="font-mono text-xs">{c.ref}</span>
							<span className="text-muted-foreground text-sm">{c.patientName}</span>
						</label>
					))}
				</div>
			</div>
			<div className="flex gap-2">
				<Button type="submit" disabled={selectedCases.length < 2 || !title || !description || create.isPending}>
					{create.isPending ? "Creating…" : "Create incident"}
				</Button>
				<Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
			</div>
		</form>
	)
}
