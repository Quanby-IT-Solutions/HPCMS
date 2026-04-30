"use client"

import { useState } from "react"
import { toast } from "sonner"

import type { ConsentCategory } from "@repo/contracts"

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
import { Textarea } from "@/core/components/ui/textarea"
import {
	useConsentListQuery,
	useConsentRecordMutation,
	useConsentWithdrawMutation,
} from "@/features/supervisor-patients/api/supervisor-consent.hooks"
import { RightRailPanel } from "@/features/supervisor-workspace/components/right-rail-panel"

const CATEGORY_LABELS: Record<ConsentCategory, string> = {
	data_processing: "Data Processing",
	communications: "Communications",
	marketing: "Marketing",
	research_use: "Research Use",
	service_specific: "Service Specific",
}

const STATUS_STYLES = {
	granted: "bg-green-100 text-green-700",
	withdrawn: "bg-red-100 text-red-700",
	not_collected: "bg-slate-100 text-slate-600",
}

type ActionMode = "record" | "withdraw" | null

interface Props {
	patientId: string
}

export function ConsentManagementPanel({ patientId }: Props) {
	const { data, isLoading } = useConsentListQuery(patientId)
	const record = useConsentRecordMutation()
	const withdraw = useConsentWithdrawMutation()

	const [mode, setMode] = useState<ActionMode>(null)
	const [consentDoc, setConsentDoc] = useState<File | null>(null)
	const [selectedCategory, setSelectedCategory] = useState<ConsentCategory>("data_processing")
	const [captureMethod, setCaptureMethod] = useState<"written" | "verbal_witnessed" | "electronic">("electronic")
	const [date, setDate] = useState("")
	const [withdrawReason, setWithdrawReason] = useState("")
	const [withdrawDate, setWithdrawDate] = useState("")
	const [confirmWithdraw, setConfirmWithdraw] = useState(false)

	const hasWithdrawn = data?.categories.some(c => c.status === "withdrawn")

	async function handleRecord() {
		if (!date) return
		try {
			await record.mutateAsync({
				patientId,
				category: selectedCategory,
				status: "granted",
				captureMethod,
				date,
				documentKey: consentDoc?.name || undefined,
			})
			toast.success("Consent recorded")
			setMode(null)
			setDate("")
		} catch (err) {
			toast.error("Failed to record consent", { description: (err as Error).message })
		}
	}

	async function handleWithdraw() {
		if (!withdrawDate || !withdrawReason || !confirmWithdraw) return
		try {
			await withdraw.mutateAsync({
				patientId,
				category: selectedCategory,
				effectiveDate: withdrawDate,
				reason: withdrawReason,
			})
			toast.success("Consent withdrawn")
			setMode(null)
			setWithdrawReason("")
			setWithdrawDate("")
			setConfirmWithdraw(false)
		} catch (err) {
			toast.error("Failed to withdraw consent", { description: (err as Error).message })
		}
	}

	return (
		<RightRailPanel
			title="Consent"
			storageKey={`consent-${patientId}`}
			isLoading={isLoading}
			actions={
				<div className="flex gap-1">
					<Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setMode(mode === "record" ? null : "record")}>
						Record
					</Button>
					<Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setMode(mode === "withdraw" ? null : "withdraw")}>
						Withdraw
					</Button>
				</div>
			}
		>
			<div className="flex flex-col gap-3 text-sm">
				{hasWithdrawn ? (
					<div className="rounded-md bg-red-50 px-2 py-1.5 text-xs font-medium text-red-700">
						Consent restriction active
					</div>
				) : null}

				<div className="flex flex-col gap-1">
					{(data?.categories ?? []).map(c => (
						<div key={c.category} className="flex items-center justify-between">
							<span className="text-muted-foreground">{CATEGORY_LABELS[c.category]}</span>
							<div className="flex items-center gap-1.5">
								{c.effectiveDate ? (
									<span className="text-[10px] text-muted-foreground">
										{new Date(c.effectiveDate).toLocaleDateString()}
									</span>
								) : null}
								<span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${STATUS_STYLES[c.status]}`}>
									{c.status.replace("_", " ")}
								</span>
							</div>
						</div>
					))}
				</div>

				{mode === "record" ? (
					<div className="border-t pt-2 flex flex-col gap-2">
						<Label className="text-xs">Category</Label>
						<Select value={selectedCategory} onValueChange={v => setSelectedCategory(v as ConsentCategory)}>
							<SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
							<SelectContent>
								{Object.entries(CATEGORY_LABELS).map(([k, l]) => (
									<SelectItem key={k} value={k}>{l}</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Label className="text-xs">Capture method</Label>
						<Select value={captureMethod} onValueChange={v => setCaptureMethod(v as typeof captureMethod)}>
							<SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
							<SelectContent>
								<SelectItem value="electronic">Electronic</SelectItem>
								<SelectItem value="written">Written</SelectItem>
								<SelectItem value="verbal_witnessed">Verbal (witnessed)</SelectItem>
							</SelectContent>
						</Select>
						<Label className="text-xs">Date</Label>
						<Input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-7 text-xs" />
						<div className="flex flex-col gap-1">
							<Label className="text-xs">Document (optional)</Label>
							<input type="file" accept=".pdf,.jpg,.png" className="text-xs" onChange={e => setConsentDoc(e.target.files?.[0] ?? null)} />
						</div>
						<div className="flex gap-1">
							<Button size="sm" className="h-7 text-xs" onClick={handleRecord} disabled={!date || record.isPending}>
								{record.isPending ? "Saving…" : "Save"}
							</Button>
							<Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setMode(null)}>Cancel</Button>
						</div>
					</div>
				) : null}

				{mode === "withdraw" ? (
					<div className="border-t pt-2 flex flex-col gap-2">
						<Label className="text-xs">Category</Label>
						<Select value={selectedCategory} onValueChange={v => setSelectedCategory(v as ConsentCategory)}>
							<SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
							<SelectContent>
								{Object.entries(CATEGORY_LABELS).map(([k, l]) => (
									<SelectItem key={k} value={k}>{l}</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Label className="text-xs">Effective date</Label>
						<Input type="date" value={withdrawDate} onChange={e => setWithdrawDate(e.target.value)} className="h-7 text-xs" />
						<Label className="text-xs">Reason</Label>
						<Textarea rows={2} value={withdrawReason} onChange={e => setWithdrawReason(e.target.value)} className="text-xs" />
						<label className="flex items-center gap-1.5 text-xs cursor-pointer">
							<input type="checkbox" checked={confirmWithdraw} onChange={e => setConfirmWithdraw(e.target.checked)} className="size-3.5" />
							I confirm this withdrawal
						</label>
						<div className="flex gap-1">
							<Button size="sm" className="h-7 text-xs" variant="destructive" onClick={handleWithdraw} disabled={!confirmWithdraw || !withdrawReason || !withdrawDate || withdraw.isPending}>
								{withdraw.isPending ? "Withdrawing…" : "Withdraw"}
							</Button>
							<Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setMode(null)}>Cancel</Button>
						</div>
					</div>
				) : null}

				{(data?.history ?? []).length > 0 ? (
					<div className="border-t pt-2">
						<p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">History</p>
						{data!.history.map(h => (
							<div key={h.id} className="py-0.5 text-xs">
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">{CATEGORY_LABELS[h.category]} · {h.recordedBy}</span>
									<span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] ${STATUS_STYLES[h.status]}`}>{h.status.replace("_", " ")}</span>
								</div>
								<p className="text-[10px] text-muted-foreground">{new Date(h.recordedAt).toLocaleString()}</p>
							</div>
						))}
					</div>
				) : null}
			</div>
		</RightRailPanel>
	)
}
