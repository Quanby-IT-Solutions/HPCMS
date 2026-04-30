"use client"

import { useState } from "react"
import { toast } from "sonner"

import type { ClaimHeader, ClaimType } from "@repo/contracts"

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
import {
	usePayersListQuery,
	useUpsertClaimHeaderMutation,
} from "@/features/agent-claims/api/claims.hooks"

const CLAIM_TYPE_OPTIONS: Array<{ value: ClaimType; label: string }> = [
	{ value: "loa", label: "LOA" },
	{ value: "hospitalization", label: "Hospitalization" },
	{ value: "outpatient", label: "Outpatient" },
]

/**
 * Wrapper resets the form state whenever the underlying header.id changes
 * by remounting via `key`, instead of fighting React purity rules with
 * useEffect+setState cascades.
 */
export function ClaimHeaderForm({ header }: { header: ClaimHeader }) {
	return <ClaimHeaderFormInner key={header.id} header={header} />
}

function ClaimHeaderFormInner({ header }: { header: ClaimHeader }) {
	const payersQ = usePayersListQuery()
	const upsert = useUpsertClaimHeaderMutation()

	const [payerId, setPayerId] = useState(header.payerId)
	const [memberId, setMemberId] = useState(header.memberId ?? "")
	const [claimType, setClaimType] = useState<ClaimType>(header.claimType)
	const [submissionDate, setSubmissionDate] = useState<string>(
		header.submissionDate
			? new Date(header.submissionDate).toISOString().slice(0, 10)
			: ""
	)
	const [totalAmount, setTotalAmount] = useState(String(header.totalAmount))

	function handleSave() {
		upsert.mutate(
			{
				id: header.id,
				caseRef: header.caseRef,
				patientId: header.patientId,
				payerId,
				coverageId: header.coverageId,
				memberId: memberId.trim() || null,
				claimType,
				submissionDate: submissionDate ? new Date(submissionDate).toISOString() : null,
				totalAmount: Number(totalAmount) || 0,
			},
			{
				onSuccess: () => toast.success("Claim header saved"),
				onError: err =>
					toast.error("Could not save", { description: (err as Error).message }),
			}
		)
	}

	return (
		<div className="flex flex-col gap-3 rounded-md border p-4">
			<h2 className="text-sm font-semibold">Claim header</h2>
			<div className="grid gap-3 sm:grid-cols-2">
				<div className="flex flex-col gap-1">
					<Label htmlFor="payer">Payer</Label>
					<Select value={payerId} onValueChange={v => setPayerId(v ?? "")}>
						<SelectTrigger id="payer">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{(payersQ.data?.payers ?? []).map(p => (
								<SelectItem key={p.id} value={p.id}>
									{p.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-1">
					<Label htmlFor="member-id">Member ID</Label>
					<Input
						id="member-id"
						value={memberId}
						onChange={e => setMemberId(e.target.value)}
						placeholder="PHIC-12-1234567-8"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label htmlFor="claim-type">Claim type</Label>
					<Select
						value={claimType}
						onValueChange={v => setClaimType(v as ClaimType)}
					>
						<SelectTrigger id="claim-type">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{CLAIM_TYPE_OPTIONS.map(o => (
								<SelectItem key={o.value} value={o.value}>
									{o.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-1">
					<Label htmlFor="sub-date">Submission date</Label>
					<Input
						id="sub-date"
						type="date"
						value={submissionDate}
						onChange={e => setSubmissionDate(e.target.value)}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label htmlFor="total">Total amount (₱)</Label>
					<Input
						id="total"
						type="number"
						min={0}
						value={totalAmount}
						onChange={e => setTotalAmount(e.target.value)}
					/>
				</div>
			</div>
			<div className="flex justify-end">
				<Button size="sm" onClick={handleSave} disabled={upsert.isPending}>
					{upsert.isPending ? "Saving…" : "Save header"}
				</Button>
			</div>
		</div>
	)
}
