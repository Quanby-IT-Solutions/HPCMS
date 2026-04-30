"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
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
import { Textarea } from "@/core/components/ui/textarea"
import { useUpdateDemographicsMutation } from "@/features/supervisor-patients/api/supervisor-patients.hooks"

interface PatientData {
	id: string
	fullName?: string
	dateOfBirth?: string
	sex?: string
	ethnicity?: string
	email?: string
	phone?: string
}

interface Props {
	patient: PatientData
}

export function EditDemographicsModal({ patient }: Props) {
	const [open, setOpen] = useState(false)
	const [form, setForm] = useState({
		fullName: patient.fullName ?? "",
		dateOfBirth: patient.dateOfBirth ?? "",
		sexAtBirth: patient.sex ?? "",
		ethnicity: patient.ethnicity ?? "",
		email: patient.email ?? "",
		phone: patient.phone ?? "",
		changeReason: "",
	})
	const update = useUpdateDemographicsMutation()

	function set(key: string, value: string) {
		setForm(prev => ({ ...prev, [key]: value }))
	}

	async function handleSave() {
		if (!form.changeReason.trim()) return
		try {
			await update.mutateAsync({
				patientId: patient.id,
				fullName: form.fullName || undefined,
				dateOfBirth: form.dateOfBirth || undefined,
				sexAtBirth: form.sexAtBirth || undefined,
				ethnicity: form.ethnicity || undefined,
				email: form.email || undefined,
				phone: form.phone || undefined,
				changeReason: form.changeReason.trim(),
			})
			toast.success("Demographics updated")
			setOpen(false)
		} catch (err) {
			toast.error("Update failed", { description: (err as Error).message })
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger render={<Button variant="outline" size="sm">Edit Demographics</Button>} />
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Edit Demographics</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-3">
					<div className="flex flex-col gap-1">
						<Label htmlFor="ed-name">Full name</Label>
						<Input id="ed-name" value={form.fullName} onChange={e => set("fullName", e.target.value)} />
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1">
							<Label htmlFor="ed-dob">Date of birth</Label>
							<Input id="ed-dob" type="date" value={form.dateOfBirth} onChange={e => set("dateOfBirth", e.target.value)} />
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="ed-sex">Sex at birth</Label>
							<Select value={form.sexAtBirth ?? ""} onValueChange={v => v && set("sexAtBirth", v)}>
								<SelectTrigger id="ed-sex"><SelectValue /></SelectTrigger>
								<SelectContent>
									<SelectItem value="male">Male</SelectItem>
									<SelectItem value="female">Female</SelectItem>
									<SelectItem value="other">Other</SelectItem>
									<SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<Label htmlFor="ed-eth">Ethnicity</Label>
						<Input id="ed-eth" value={form.ethnicity} onChange={e => set("ethnicity", e.target.value)} />
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1">
							<Label htmlFor="ed-email">Email</Label>
							<Input id="ed-email" type="email" value={form.email} onChange={e => set("email", e.target.value)} />
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="ed-phone">Phone</Label>
							<Input id="ed-phone" value={form.phone} onChange={e => set("phone", e.target.value)} />
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<Label htmlFor="ed-reason">Change reason *</Label>
						<Textarea
							id="ed-reason"
							value={form.changeReason}
							onChange={e => set("changeReason", e.target.value)}
							rows={2}
							placeholder="Reason for this edit…"
							maxLength={500}
						/>
						<span className="text-muted-foreground text-[10px]">{form.changeReason.length}/500</span>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" size="sm" onClick={() => setOpen(false)} disabled={update.isPending}>Cancel</Button>
					<Button size="sm" onClick={handleSave} disabled={!form.changeReason.trim() || update.isPending}>
						{update.isPending ? "Saving…" : "Save changes"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
