"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import { Label } from "@/core/components/ui/label"
import { Textarea } from "@/core/components/ui/textarea"
import { useMergePatientsMutation } from "@/features/supervisor-patients/api/supervisor-merge.hooks"
import { usePatientGetQuery } from "@/features/supervisor-patients/api/supervisor-patients.hooks"
import { SUPERVISOR_ROUTES } from "@/app/(staff)/supervisor/supervisor-routes"

const FIELDS = ["fullName", "dateOfBirth", "sexAtBirth", "ethnicity", "email", "phone", "hmoProvider"] as const
const FIELD_LABELS: Record<string, string> = {
	fullName: "Full name",
	dateOfBirth: "Date of birth",
	sexAtBirth: "Sex at birth",
	ethnicity: "Ethnicity",
	email: "Email",
	phone: "Phone",
	hmoProvider: "HMO provider",
}

interface Props {
	survivorId: string
	supersededId: string
}

export function MergeConfirmationPage({ survivorId, supersededId }: Props) {
	const router = useRouter()
	const { data: survivorData } = usePatientGetQuery(survivorId)
	const { data: supersededData } = usePatientGetQuery(supersededId)

	const [fieldResolutions, setFieldResolutions] = useState<Record<string, string>>({})
	const [reason, setReason] = useState("")
	const merge = useMergePatientsMutation()

	function pickField(field: string, from: "survivor" | "superseded") {
		const value = from === "survivor"
			? (survivorData as unknown as Record<string, unknown>)?.[field]
			: (supersededData as unknown as Record<string, unknown>)?.[field]
		setFieldResolutions(prev => ({ ...prev, [field]: String(value ?? "") }))
	}

	async function handleMerge() {
		if (!reason.trim()) return
		try {
			const result = await merge.mutateAsync({
				survivorId,
				supersededId,
				fieldResolutions,
				reason: reason.trim(),
			})
			toast.success("Records merged")
			router.push(`${SUPERVISOR_ROUTES.patientProfile(result.survivorId)}?merged=true`)
		} catch (err) {
			toast.error("Merge failed", { description: (err as Error).message })
		}
	}

	return (
		<div className="flex flex-col gap-6 max-w-3xl">
			<header>
				<h1 className="text-2xl font-bold">Merge Patient Records</h1>
				<p className="text-muted-foreground text-sm">Select which value to keep for each field.</p>
			</header>

			<div className="rounded-md border">
				<div className="grid grid-cols-3 border-b px-4 py-2 text-xs font-semibold text-muted-foreground">
					<span>Field</span>
					<span>Record A (survivor)</span>
					<span>Record B (superseded)</span>
				</div>
				{FIELDS.map(field => {
					const aVal = String((survivorData as unknown as Record<string, unknown>)?.[field] ?? "—")
					const bVal = String((supersededData as unknown as Record<string, unknown>)?.[field] ?? "—")
					const chosen = fieldResolutions[field]
					const differs = aVal !== bVal && aVal !== "—" && bVal !== "—"
					return (
						<div key={field} className={`grid grid-cols-3 border-b px-4 py-2 text-sm last:border-0 ${differs ? "bg-yellow-50" : ""}`}>
							<span className="font-medium">{FIELD_LABELS[field]}{differs ? <span className="ml-1 text-[10px] text-yellow-700 font-normal">(differs)</span> : null}</span>
							<label className="flex items-center gap-2 cursor-pointer">
								<input type="radio" name={field} checked={chosen === aVal} onChange={() => pickField(field, "survivor")} className="size-3.5" />
								<span className={chosen === aVal ? "font-semibold" : ""}>{aVal}</span>
							</label>
							<label className="flex items-center gap-2 cursor-pointer">
								<input type="radio" name={field} checked={chosen === bVal} onChange={() => pickField(field, "superseded")} className="size-3.5" />
								<span className={chosen === bVal ? "font-semibold" : ""}>{bVal}</span>
							</label>
						</div>
					)
				})}
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="merge-reason">Merge reason *</Label>
				<Textarea
					id="merge-reason"
					value={reason}
					onChange={e => setReason(e.target.value)}
					rows={3}
					placeholder="Why are these records being merged?"
				/>
			</div>

			<div className="flex gap-2">
				<Button
					onClick={handleMerge}
					disabled={!reason.trim() || merge.isPending}
				>
					{merge.isPending ? "Merging…" : "Confirm merge"}
				</Button>
				<Button variant="outline" onClick={() => router.back()}>Cancel</Button>
			</div>
		</div>
	)
}
