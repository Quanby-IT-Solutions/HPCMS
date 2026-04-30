"use client"

import { useState } from "react"
import { toast } from "sonner"

import type { RelationshipType } from "@repo/contracts"

import { Button } from "@/core/components/ui/button"
import { Checkbox } from "@/core/components/ui/checkbox"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/core/components/ui/dialog"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select"
import { useLinkRelatedCaseMutation } from "@/features/supervisor-cases/api/supervisor-related.hooks"

const MOCK_CASES = [
	{ ref: "LOA-2026-00100", patientName: "Ana Reyes", caseType: "loa", status: "resolved", submittedAt: "2026-03-10" },
	{ ref: "BILL-2026-00015", patientName: "Carlos Santos", caseType: "billing", status: "in_review", submittedAt: "2026-04-05" },
	{ ref: "COMP-2026-00007", patientName: "Maria Lopez", caseType: "complaint", status: "submitted", submittedAt: "2026-04-20" },
]

interface Props {
	sourceCaseRef: string
	onLink: () => void
}

export function CaseSearchModal({ sourceCaseRef, onLink }: Props) {
	const [open, setOpen] = useState(false)
	const [q, setQ] = useState("")
	const [typeFilter, setTypeFilter] = useState("")
	const [dateFrom, setDateFrom] = useState("")
	const [dateTo, setDateTo] = useState("")
	const [selected, setSelected] = useState<string[]>([])
	const [relationship, setRelationship] = useState<RelationshipType>("follow_up_from")
	const link = useLinkRelatedCaseMutation()

	const filtered = MOCK_CASES.filter(c => {
		if (c.ref === sourceCaseRef) return false
		if (q && !c.ref.includes(q) && !c.patientName.toLowerCase().includes(q.toLowerCase())) return false
		if (typeFilter && c.caseType !== typeFilter) return false
		if (dateFrom && c.submittedAt < dateFrom) return false
		if (dateTo && c.submittedAt > dateTo) return false
		return true
	})

	function toggle(ref: string) {
		setSelected(prev => prev.includes(ref) ? prev.filter(r => r !== ref) : [...prev, ref])
	}

	async function handleLink() {
		for (const ref of selected) {
			await link.mutateAsync({ ref: sourceCaseRef, relatedCaseRef: ref, relationshipType: relationship })
		}
		toast.success(`Linked ${selected.length} case(s)`)
		setOpen(false)
		setSelected([])
		onLink()
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger render={<Button variant="outline" size="sm">Link Case</Button>} />
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Link Related Cases</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-3">
					<Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by case ref or patient name…" />
					<div className="flex gap-2 flex-wrap">
						<Select value={typeFilter} onValueChange={v => setTypeFilter(v ?? "")}>
							<SelectTrigger className="h-7 text-xs w-36"><SelectValue /></SelectTrigger>
							<SelectContent>
								<SelectItem value="">All types</SelectItem>
								<SelectItem value="loa">LOA</SelectItem>
								<SelectItem value="billing">Billing</SelectItem>
								<SelectItem value="complaint">Complaint</SelectItem>
							</SelectContent>
						</Select>
						<div className="flex items-center gap-1">
							<Label className="text-xs text-muted-foreground">From</Label>
							<Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-7 text-xs w-36" />
						</div>
						<div className="flex items-center gap-1">
							<Label className="text-xs text-muted-foreground">To</Label>
							<Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-7 text-xs w-36" />
						</div>
					</div>
					<div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
						{filtered.map(c => (
							<label key={c.ref} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-muted/40">
								<Checkbox checked={selected.includes(c.ref)} onCheckedChange={() => toggle(c.ref)} />
								<span className="font-mono text-xs">{c.ref}</span>
								<span className="text-muted-foreground">— {c.patientName}</span>
								<span className="ml-auto text-[10px] text-muted-foreground">{c.caseType}</span>
							</label>
						))}
						{filtered.length === 0 && <p className="text-xs text-muted-foreground px-2 py-1">No cases match filters.</p>}
					</div>
					<div className="flex flex-col gap-1.5">
						<Label>Relationship type</Label>
						<Select value={relationship} onValueChange={v => setRelationship(v as RelationshipType)}>
							<SelectTrigger><SelectValue /></SelectTrigger>
							<SelectContent>
								<SelectItem value="follow_up_from">Follow-up from</SelectItem>
								<SelectItem value="spawned_from">Spawned from</SelectItem>
								<SelectItem value="duplicate_of">Duplicate of</SelectItem>
								<SelectItem value="part_of_incident">Part of incident</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
					<Button size="sm" onClick={handleLink} disabled={selected.length === 0 || link.isPending}>
						{link.isPending ? "Linking…" : `Link ${selected.length} case(s)`}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
