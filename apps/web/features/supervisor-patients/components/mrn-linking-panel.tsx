"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/core/components/ui/dialog"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import { useFhirSyncTriggerMutation, useMrnLinkMutation } from "@/features/supervisor-patients/api/supervisor-mrn.hooks"
import { RightRailPanel } from "@/features/supervisor-workspace/components/right-rail-panel"

interface Props {
	patientId: string
	currentMrn?: string | null
	lastSyncedAt?: Date | null
}

const MOCK_FHIR_PATIENTS = [
	{ fhirId: "Patient/12345", name: "Maria Santos", dob: "1982-04-15", mrn: "MRN-001" },
	{ fhirId: "Patient/67890", name: "Maria Santos Jr.", dob: "2004-09-10", mrn: "MRN-089" },
]

export function MrnLinkingPanel({ patientId, currentMrn, lastSyncedAt }: Props) {
	const [showDialog, setShowDialog] = useState(false)
	const [searchName, setSearchName] = useState("")
	const [searchDob, setSearchDob] = useState("")
	const [searchMrn, setSearchMrn] = useState("")
	const [hasSearched, setHasSearched] = useState(false)
	const [changedFields, setChangedFields] = useState<string[] | null>(null)
	const [linkError, setLinkError] = useState<string | null>(null)
	const [syncError, setSyncError] = useState<string | null>(null)

	const linkMrn = useMrnLinkMutation()
	const triggerSync = useFhirSyncTriggerMutation()

	const filteredResults = hasSearched
		? MOCK_FHIR_PATIENTS.filter(p =>
			(!searchName || p.name.toLowerCase().includes(searchName.toLowerCase())) &&
			(!searchDob || p.dob === searchDob) &&
			(!searchMrn || p.mrn.toLowerCase().includes(searchMrn.toLowerCase()))
		)
		: []

	function handleSearch() {
		setHasSearched(true)
	}

	async function handleSelect(fhirId: string) {
		setLinkError(null)
		try {
			await linkMrn.mutateAsync({ patientId, fhirPatientId: fhirId })
			toast.success("MRN linked")
			setShowDialog(false)
			setSearchName("")
			setSearchDob("")
			setSearchMrn("")
			setHasSearched(false)
		} catch (err) {
			setLinkError((err as Error).message)
		}
	}

	async function handleSync() {
		setSyncError(null)
		try {
			const result = await triggerSync.mutateAsync({ patientId })
			setChangedFields(result.changedFields)
			toast.success("FHIR sync complete")
		} catch (err) {
			setSyncError((err as Error).message)
		}
	}

	return (
		<RightRailPanel
			title="MRN & FHIR Sync"
			storageKey={`mrn-${patientId}`}
			actions={
				<Button variant="ghost" size="sm" onClick={handleSync} disabled={triggerSync.isPending} className="text-xs h-6 px-2">
					{triggerSync.isPending ? "Syncing…" : "Re-sync"}
				</Button>
			}
		>
			<div className="flex flex-col gap-2 text-sm">
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground">MRN</span>
					<span className="font-mono text-xs">{currentMrn ?? "Not linked"}</span>
				</div>
				{lastSyncedAt ? (
					<div className="flex items-center justify-between">
						<span className="text-muted-foreground">Last sync</span>
						<span className="text-xs">{new Date(lastSyncedAt).toLocaleString()}</span>
					</div>
				) : null}

				{syncError ? (
					<div className="rounded-md bg-red-50 border border-red-200 px-2 py-1.5 text-xs text-red-700">
						<p className="font-medium mb-1">Sync failed: {syncError}</p>
						<Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={handleSync} disabled={triggerSync.isPending}>
							Retry
						</Button>
					</div>
				) : null}

				{changedFields && changedFields.length > 0 ? (
					<div className="bg-muted/40 rounded-md p-2 text-xs">
						<p className="font-medium mb-1">Updated fields:</p>
						<ul className="list-disc list-inside text-muted-foreground">
							{changedFields.map(f => <li key={f}>{f}</li>)}
						</ul>
					</div>
				) : null}

				<Button variant="outline" size="sm" className="h-7 text-xs w-fit" onClick={() => setShowDialog(true)}>
					Link MRN
				</Button>
			</div>

			<Dialog open={showDialog} onOpenChange={setShowDialog}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Search FHIR Patient</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-3">
						<div className="flex flex-col gap-1">
							<Label className="text-xs">Name</Label>
							<Input
								value={searchName}
								onChange={e => setSearchName(e.target.value)}
								placeholder="Search by name…"
								className="h-8 text-xs"
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label className="text-xs">Date of birth</Label>
							<Input
								type="date"
								value={searchDob}
								onChange={e => setSearchDob(e.target.value)}
								className="h-8 text-xs"
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label className="text-xs">MRN</Label>
							<Input
								value={searchMrn}
								onChange={e => setSearchMrn(e.target.value)}
								placeholder="MRN-…"
								className="h-8 text-xs"
							/>
						</div>
						<Button size="sm" onClick={handleSearch} className="w-fit">
							Search
						</Button>

						{hasSearched && filteredResults.length === 0 ? (
							<p className="text-xs text-muted-foreground">No results found.</p>
						) : null}

						{filteredResults.length > 0 ? (
							<div className="flex flex-col gap-2">
								{filteredResults.map(result => (
									<div key={result.fhirId} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
										<div className="flex flex-col gap-0.5">
											<span className="font-medium">{result.name}</span>
											<span className="text-xs text-muted-foreground">{result.dob} · {result.mrn}</span>
											<span className="font-mono text-[10px] text-muted-foreground">{result.fhirId}</span>
										</div>
										<Button
											size="sm"
											className="h-7 text-xs"
											onClick={() => handleSelect(result.fhirId)}
											disabled={linkMrn.isPending}
										>
											Select
										</Button>
									</div>
								))}
							</div>
						) : null}

						{linkError ? (
							<div className="rounded-md bg-red-50 border border-red-200 px-2 py-1.5 text-xs text-red-700">
								<p className="font-medium mb-1">Link failed: {linkError}</p>
								<Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => setLinkError(null)}>
									Dismiss
								</Button>
							</div>
						) : null}
					</div>
				</DialogContent>
			</Dialog>
		</RightRailPanel>
	)
}
