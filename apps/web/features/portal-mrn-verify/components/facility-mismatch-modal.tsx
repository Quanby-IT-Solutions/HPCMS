"use client"

import { useState } from "react"
import { AlertTriangle } from "@/core/components/icons"

import { Button } from "@/core/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/core/components/ui/dialog"

interface FacilityMismatchModalProps {
	open: boolean
	otherTenantId: string
	onConfirm: (switchTenantTo: string) => void
	onCancel: () => void
}

export function FacilityMismatchModal({
	open,
	otherTenantId,
	onConfirm,
	onCancel,
}: FacilityMismatchModalProps) {
	const [pending, setPending] = useState(false)

	async function handleSwitch() {
		setPending(true)
		try {
			onConfirm(otherTenantId)
		} finally {
			setPending(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={open => !open && onCancel()}>
			<DialogContent>
				<DialogHeader>
					<div className="flex items-center gap-2">
						<AlertTriangle className="text-warning size-5" />
						<DialogTitle>Patient found at a different facility</DialogTitle>
					</div>
					<DialogDescription>
						Your patient record is registered under facility{" "}
						<span className="font-semibold">{otherTenantId}</span>, but you are currently logged in to
						a different facility. Would you like to switch and continue verification?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={onCancel} disabled={pending}>
						Cancel
					</Button>
					<Button onClick={handleSwitch} disabled={pending}>
						{pending ? "Switching..." : "Switch & Continue"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
