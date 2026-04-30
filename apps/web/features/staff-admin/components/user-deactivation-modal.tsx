"use client"

import * as React from "react"
import { toast } from "sonner"

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/core/components/ui/dialog"
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/core/components/ui/field"
import { Button } from "@/core/components/ui/button"
import { Checkbox } from "@/core/components/ui/checkbox"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select"

import { useDeactivateUserMutation } from "@/features/staff-admin/api/admin.hooks"

interface UserDeactivationModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	userId: string
	userName: string
	openCaseCount: number
	activeSessions: Array<{ sessionId: string; ip: string | null; lastActivity: string }>
}

const DEACTIVATION_REASONS = [
	{ value: "resigned", label: "Resigned" },
	{ value: "terminated", label: "Terminated" },
	{ value: "temporary_suspension", label: "Temporary suspension" },
	{ value: "other", label: "Other" },
] as const

type DeactivationReason = (typeof DEACTIVATION_REASONS)[number]["value"]

export function UserDeactivationModal({
	open,
	onOpenChange,
	userId,
	userName,
	openCaseCount,
	activeSessions,
}: UserDeactivationModalProps) {
	const [reason, setReason] = React.useState<DeactivationReason | "">("")
	const [confirmed, setConfirmed] = React.useState(false)
	const [reasonError, setReasonError] = React.useState("")
	const [confirmError, setConfirmError] = React.useState("")

	const { mutate, isPending } = useDeactivateUserMutation()

	function resetState() {
		setReason("")
		setConfirmed(false)
		setReasonError("")
		setConfirmError("")
	}

	function handleOpenChange(nextOpen: boolean) {
		if (!nextOpen) resetState()
		onOpenChange(nextOpen)
	}

	function handleDeactivate() {
		let hasError = false

		if (!reason) {
			setReasonError("Please select a reason")
			hasError = true
		} else {
			setReasonError("")
		}

		if (!confirmed) {
			setConfirmError("You must confirm before deactivating")
			hasError = true
		} else {
			setConfirmError("")
		}

		if (hasError) return

		mutate(
			{ userId, reason },
			{
				onSuccess: () => {
					toast.success(`${userName} has been deactivated`)
					handleOpenChange(false)
				},
				onError: (err) => {
					toast.error(err instanceof Error ? err.message : "Failed to deactivate user")
				},
			}
		)
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Deactivate User</DialogTitle>
					<DialogDescription>
						You are about to deactivate <strong>{userName}</strong>. This action will log them out
						immediately.
					</DialogDescription>
				</DialogHeader>

				<FieldGroup className="py-2">
					{openCaseCount > 0 && (
						<div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
							This user has{" "}
							<strong>
								{openCaseCount} open {openCaseCount === 1 ? "case" : "cases"}
							</strong>
							. Please reassign them before deactivating.
						</div>
					)}

					{activeSessions.length > 0 && (
						<div className="flex flex-col gap-1.5">
							<p className="text-sm font-medium">Active sessions ({activeSessions.length})</p>
							<div className="rounded-lg border">
								{activeSessions.map(session => (
									<div
										key={session.sessionId}
										className="border-b px-3 py-2 last:border-b-0"
									>
										<div className="flex items-center justify-between gap-2 text-sm">
											<span className="text-muted-foreground font-mono text-xs">
												{session.ip ?? "Unknown IP"}
											</span>
											<span className="text-muted-foreground text-xs">
												Last active: {session.lastActivity}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					<Field data-invalid={!!reasonError}>
						<FieldLabel>Reason for deactivation</FieldLabel>
						<Select
							value={reason}
							onValueChange={(value) => {
								setReason((value ?? "") as DeactivationReason)
								if (reasonError) setReasonError("")
							}}
							disabled={isPending}
						>
							<SelectTrigger className="w-full" aria-invalid={!!reasonError}>
								<SelectValue>{reason ? DEACTIVATION_REASONS.find(r => r.value === reason)?.label : <span className="text-muted-foreground">Select a reason…</span>}</SelectValue>
							</SelectTrigger>
							<SelectContent>
								{DEACTIVATION_REASONS.map(opt => (
									<SelectItem key={opt.value} value={opt.value}>
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{reasonError && <FieldError>{reasonError}</FieldError>}
					</Field>

					<Field data-invalid={!!confirmError}>
						<div className="flex items-start gap-3">
							<Checkbox
								id="deactivate-confirm"
								checked={confirmed}
								onCheckedChange={(checked) => {
									setConfirmed(checked === true)
									if (confirmError) setConfirmError("")
								}}
								disabled={isPending}
							/>
							<label
								htmlFor="deactivate-confirm"
								className="cursor-pointer text-sm leading-snug"
							>
								I understand this user will be logged out immediately
							</label>
						</div>
						{confirmError && <FieldError>{confirmError}</FieldError>}
					</Field>
				</FieldGroup>

				<DialogFooter showCloseButton>
					<Button
						type="button"
						variant="destructive"
						disabled={isPending}
						onClick={handleDeactivate}
					>
						{isPending ? "Deactivating..." : "Deactivate"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
