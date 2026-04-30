"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select"
import { Skeleton } from "@/core/components/ui/skeleton"
import { Textarea } from "@/core/components/ui/textarea"
import {
	useIncidentAddCaseMutation,
	useIncidentGetQuery,
	useIncidentRemoveCaseMutation,
	useIncidentUpdateMutation,
} from "@/features/supervisor-incidents/api/supervisor-incidents.hooks"
import { authClient } from "@/services/better-auth/auth-client"

const SEVERITY_STYLES: Record<string, string> = {
	low: "bg-blue-100 text-blue-700",
	medium: "bg-yellow-100 text-yellow-700",
	high: "bg-orange-100 text-orange-700",
	critical: "bg-red-100 text-red-700",
}

interface Props {
	incidentId: string
}

export function IncidentDetailPage({ incidentId }: Props) {
	const { data, isLoading } = useIncidentGetQuery(incidentId)
	const update = useIncidentUpdateMutation()
	const addCase = useIncidentAddCaseMutation()
	const removeCase = useIncidentRemoveCaseMutation()
	const { data: session } = authClient.useSession()
	const readOnly = (session?.user as { role?: string })?.role === "tenant_admin"

	const [rootCause, setRootCause] = useState("")
	const [resolution, setResolution] = useState("")
	const [newCaseRef, setNewCaseRef] = useState("")
	const [newStatus, setNewStatus] = useState("")

	if (isLoading || !data) {
		return <div className="flex flex-col gap-3"><Skeleton className="h-8 w-48" /><Skeleton className="h-48 w-full" /></div>
	}

	async function handleUpdate(field: "rootCauseNotes" | "resolutionDoc" | "status") {
		const payload = field === "rootCauseNotes"
			? { id: incidentId, rootCauseNotes: rootCause }
			: field === "resolutionDoc"
			? { id: incidentId, resolutionDoc: resolution }
			: { id: incidentId, status: newStatus as "detected" | "investigating" | "mitigating" | "resolved" | "closed" }
		try {
			await update.mutateAsync(payload)
			toast.success("Saved")
			if (field === "status") setNewStatus("")
		} catch (err) {
			toast.error("Failed", { description: (err as Error).message })
		}
	}

	async function handleAddCase() {
		if (!newCaseRef.trim()) return
		try {
			await addCase.mutateAsync({ id: incidentId, caseRef: newCaseRef.trim() })
			toast.success("Case added")
			setNewCaseRef("")
		} catch (err) {
			toast.error("Failed", { description: (err as Error).message })
		}
	}

	async function handleRemoveCase(ref: string) {
		try {
			await removeCase.mutateAsync({ id: incidentId, caseRef: ref })
			toast.success("Case removed")
		} catch (err) {
			toast.error("Failed", { description: (err as Error).message })
		}
	}

	return (
		<div className="flex flex-col gap-4 max-w-2xl">
			<header>
				<div className="flex items-center gap-2 flex-wrap">
					<h1 className="text-2xl font-bold">{data.title}</h1>
					<span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${SEVERITY_STYLES[data.severity]}`}>
						{data.severity}
					</span>
					<span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-[11px] font-medium">
						{data.status}
					</span>
				</div>
				<p className="text-muted-foreground text-sm mt-1">{data.description}</p>
			</header>

			{data.affectedScope && (
				<div className="rounded-md border p-4">
					<h3 className="font-semibold text-sm mb-2">Affected Scope</h3>
					<div className="grid grid-cols-3 gap-3 text-xs">
						{[
							{ label: "Departments", items: (data.affectedScope as { departments: string[]; cohorts: string[]; systems: string[] }).departments },
							{ label: "Cohorts", items: (data.affectedScope as { departments: string[]; cohorts: string[]; systems: string[] }).cohorts },
							{ label: "Systems", items: (data.affectedScope as { departments: string[]; cohorts: string[]; systems: string[] }).systems },
						].map(({ label, items }) => (
							<div key={label}>
								<p className="font-medium text-muted-foreground mb-1">{label}</p>
								{items.length > 0
									? items.map(item => <p key={item}>{item}</p>)
									: <p className="italic text-muted-foreground">None</p>}
							</div>
						))}
					</div>
				</div>
			)}

			{!readOnly && (
				<div className="rounded-md border p-4 flex flex-col gap-3">
					<h3 className="font-semibold text-sm">Update Status</h3>
					<div className="flex gap-2">
						<Select value={newStatus} onValueChange={v => setNewStatus(v ?? "")}>
							<SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
							<SelectContent>
								<SelectItem value="detected">Detected</SelectItem>
								<SelectItem value="investigating">Investigating</SelectItem>
								<SelectItem value="mitigating">Mitigating</SelectItem>
								<SelectItem value="resolved">Resolved</SelectItem>
								<SelectItem value="closed">Closed</SelectItem>
							</SelectContent>
						</Select>
						<Button size="sm" onClick={() => handleUpdate("status")} disabled={!newStatus || update.isPending}>Save</Button>
					</div>
				</div>
			)}

			<div className="rounded-md border p-4">
				<h3 className="font-semibold text-sm mb-2">Affected Cases</h3>
				<div className="flex flex-col gap-1 mb-3">
					{data.caseRefs.map(ref => (
						<div key={ref} className="flex items-center justify-between">
							<span className="font-mono text-xs">{ref}</span>
							{!readOnly && (
								<Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => handleRemoveCase(ref)} disabled={removeCase.isPending}>Remove</Button>
							)}
						</div>
					))}
				</div>
				{!readOnly && (
					<div className="flex gap-2">
						<Input value={newCaseRef} onChange={e => setNewCaseRef(e.target.value)} placeholder="Add case ref…" className="h-7 text-xs" />
						<Button size="sm" className="h-7 text-xs" onClick={handleAddCase} disabled={!newCaseRef.trim() || addCase.isPending}>Add</Button>
					</div>
				)}
			</div>

			<div className="rounded-md border p-4 flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<h3 className="font-semibold text-sm">Root Cause Notes</h3>
					<span className="text-[10px] text-muted-foreground">Last saved: {new Date(data.updatedAt).toLocaleString()}</span>
				</div>
				{readOnly
					? <p className="text-sm text-muted-foreground whitespace-pre-wrap">{data.rootCauseNotes || "—"}</p>
					: <>
						<Textarea value={rootCause || data.rootCauseNotes || ""} onChange={e => setRootCause(e.target.value)} rows={3} maxLength={2000} />
						<Button size="sm" className="w-fit" onClick={() => handleUpdate("rootCauseNotes")} disabled={update.isPending}>Save notes</Button>
					</>
				}
			</div>

			<div className="rounded-md border p-4 flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<h3 className="font-semibold text-sm">Resolution Documentation</h3>
					<span className="text-[10px] text-muted-foreground">Last saved: {new Date(data.updatedAt).toLocaleString()}</span>
				</div>
				{readOnly
					? <p className="text-sm text-muted-foreground whitespace-pre-wrap">{data.resolutionDoc || "—"}</p>
					: <>
						<Textarea value={resolution || data.resolutionDoc || ""} onChange={e => setResolution(e.target.value)} rows={4} maxLength={5000} />
						<Button size="sm" className="w-fit" onClick={() => handleUpdate("resolutionDoc")} disabled={update.isPending}>Save documentation</Button>
					</>
				}
			</div>

			{data.statusTimeline.length > 0 ? (
				<div className="rounded-md border p-4">
					<h3 className="font-semibold text-sm mb-2">Status Timeline</h3>
					{data.statusTimeline.map(e => (
						<div key={e.id} className="border-b py-2 text-xs last:border-0">
							<div className="flex justify-between">
								<span className="font-medium">{e.status}</span>
								<span className="text-muted-foreground">{new Date(e.updatedAt).toLocaleString()}</span>
							</div>
							<p className="text-muted-foreground">{e.updatedBy}</p>
							{e.note ? <p className="mt-0.5">{e.note}</p> : null}
						</div>
					))}
				</div>
			) : null}
		</div>
	)
}
