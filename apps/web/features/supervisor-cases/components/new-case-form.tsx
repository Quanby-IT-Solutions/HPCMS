"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { SUPERVISOR_ROUTES } from "@/app/(staff)/supervisor/supervisor-routes"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select"
import { Skeleton } from "@/core/components/ui/skeleton"
import { Textarea } from "@/core/components/ui/textarea"
import { useCaseTypesForFormQuery, useSupervisorCaseCreateMutation } from "@/features/supervisor-cases/api/supervisor-cases.hooks"
import { FhirPractitionerSearch } from "@/features/supervisor-practitioners/components/fhir-practitioner-search"

interface Props {
	patientId: string
}

export function NewCaseForm({ patientId }: Props) {
	const router = useRouter()
	const [form, setForm] = useState({
		caseType: "loa",
		sourceChannel: "email",
		priority: "medium",
		practitionerId: "",
		description: "",
		teamId: "",
	})
	const [hmoAuthNumber, setHmoAuthNumber] = useState("")
	const [complaintCategory, setComplaintCategory] = useState("")
	const [referringDept, setReferringDept] = useState("")
	const [practitionerLabel, setPractitionerLabel] = useState("")
	const create = useSupervisorCaseCreateMutation()
	const { data: caseTypesData, isLoading: caseTypesLoading } = useCaseTypesForFormQuery()
	const activeCaseTypes = (caseTypesData?.items ?? []).filter(ct => ct.status === "active")

	function set(k: string, v: string) {
		setForm(prev => ({ ...prev, [k]: v }))
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (!form.description.trim()) return
		try {
			const result = await create.mutateAsync({
				patientId,
				caseType: form.caseType,
				sourceChannel: form.sourceChannel || undefined,
				priority: form.priority as "low" | "medium" | "high" | "urgent",
				practitionerFhirId: form.practitionerId || undefined,
				description: form.description.trim(),
				teamId: form.teamId || undefined,
				hmoAuthNumber: hmoAuthNumber.trim() || undefined,
				complaintCategory: complaintCategory.trim() || undefined,
				referringDept: referringDept.trim() || undefined,
			})
			toast.success("Case created")
			router.push(SUPERVISOR_ROUTES.caseDetail(result.caseRef))
		} catch (err) {
			toast.error("Case creation failed", { description: (err as Error).message })
		}
	}

	return (
		<form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
			<header>
				<h1 className="text-2xl font-bold">New Case</h1>
			</header>
			<div className="grid grid-cols-2 gap-3">
				<div className="flex flex-col gap-1">
					<Label>Case type</Label>
					{caseTypesLoading ? (
						<Skeleton className="h-9 w-full rounded-md" />
					) : (
						<Select value={form.caseType} onValueChange={v => v && set("caseType", v)}>
							<SelectTrigger><SelectValue /></SelectTrigger>
							<SelectContent>
								{activeCaseTypes.map(ct => (
									<SelectItem key={ct.id} value={ct.id}>{ct.name}</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				</div>
				<div className="flex flex-col gap-1">
					<Label>Priority</Label>
					<Select value={form.priority} onValueChange={v => v && set("priority", v)}>
						<SelectTrigger><SelectValue /></SelectTrigger>
						<SelectContent>
							<SelectItem value="low">Low</SelectItem>
							<SelectItem value="medium">Medium</SelectItem>
							<SelectItem value="high">High</SelectItem>
							<SelectItem value="urgent">Urgent</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-1">
					<Label>Source channel</Label>
					<Select value={form.sourceChannel} onValueChange={v => v && set("sourceChannel", v)}>
						<SelectTrigger><SelectValue /></SelectTrigger>
						<SelectContent>
							<SelectItem value="email">Email</SelectItem>
							<SelectItem value="phone">Phone</SelectItem>
							<SelectItem value="portal_chat">Portal chat</SelectItem>
							<SelectItem value="social_media">Social media</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-1">
					<Label>Team ID</Label>
					<Input value={form.teamId} onChange={e => set("teamId", e.target.value)} placeholder="Optional" />
				</div>
			</div>
			{(form.caseType === "loa" || form.caseType === "billing") && (
				<div className="flex flex-col gap-1">
					<Label>HMO Authorization Number</Label>
					<Input value={hmoAuthNumber} onChange={e => setHmoAuthNumber(e.target.value)} placeholder="Optional" />
				</div>
			)}
			{form.caseType === "complaint" && (
				<div className="flex flex-col gap-1">
					<Label>Complaint Category</Label>
					<Input value={complaintCategory} onChange={e => setComplaintCategory(e.target.value)} placeholder="e.g. Billing Error, Clinical Concern" />
				</div>
			)}
			{form.caseType === "referral" && (
				<div className="flex flex-col gap-1">
					<Label>Referring Department</Label>
					<Input value={referringDept} onChange={e => setReferringDept(e.target.value)} placeholder="Department name" />
				</div>
			)}
			<div className="flex flex-col gap-1">
				<Label>Attending practitioner</Label>
				<FhirPractitionerSearch
					onSelect={p => {
						if (p.type === "practitioner") {
							set("practitionerId", p.id)
							setPractitionerLabel("")
						} else {
							set("practitionerId", "")
							setPractitionerLabel(p.text)
						}
					}}
					placeholder="Search practitioners…"
				/>
				{practitionerLabel && (
					<p className="text-[11px] text-muted-foreground">
						Free-text entry: <em>{practitionerLabel}</em> — will be logged as unverified
					</p>
				)}
			</div>
			<div className="flex flex-col gap-1">
				<Label>Description *</Label>
				<Textarea value={form.description} onChange={e => set("description", e.target.value)} rows={4} maxLength={2000} placeholder="Describe the case…" />
			</div>
			<div className="flex gap-2">
				<Button type="submit" disabled={!form.description.trim() || create.isPending}>
					{create.isPending ? "Creating…" : "Create case"}
				</Button>
				<Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
			</div>
		</form>
	)
}
