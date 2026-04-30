"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

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
import { usePatientCheckDuplicatesMutation, useSupervisorPatientRegisterMutation } from "@/features/supervisor-patients/api/supervisor-patients.hooks"
import { DuplicateDetectionModal } from "@/features/supervisor-patients/components/duplicate-detection-modal"
import type { DuplicateCandidate } from "@repo/contracts"
import { SUPERVISOR_ROUTES } from "@/app/(staff)/supervisor/supervisor-routes"

export function PatientRegistrationForm() {
	const router = useRouter()
	const searchParams = useSearchParams()

	const nameParam = searchParams.get("name")
	const defaultFirstName = nameParam
		? (nameParam.includes(" ") ? nameParam.substring(0, nameParam.lastIndexOf(" ")) : nameParam)
		: (searchParams.get("firstName") ?? "")
	const defaultLastName = nameParam
		? (nameParam.includes(" ") ? nameParam.substring(nameParam.lastIndexOf(" ") + 1) : "")
		: (searchParams.get("lastName") ?? "")

	const [form, setForm] = useState({
		firstName: defaultFirstName,
		lastName: defaultLastName,
		middleName: "",
		dateOfBirth: searchParams.get("dob") ?? "",
		sexAtBirth: "",
		ethnicity: "",
		street: "",
		city: "",
		province: "",
		postalCode: "",
		email: "",
		phone: "",
		emergencyContactName: "",
		emergencyContactPhone: "",
		hmoCardNumber: "",
		hmoProvider: "",
		consentDataProcessing: false,
		consentCommunications: false,
		consentServiceCategories: false,
	})

	const [duplicateCandidates, setDuplicateCandidates] = useState<DuplicateCandidate[]>([])
	const [showDuplicateModal, setShowDuplicateModal] = useState(false)

	const checkDuplicates = usePatientCheckDuplicatesMutation()
	const register = useSupervisorPatientRegisterMutation()

	function set(key: string, value: string | boolean) {
		setForm(prev => ({ ...prev, [key]: value }))
	}

	const isValid = form.firstName && form.lastName && form.dateOfBirth && form.sexAtBirth

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (!isValid) return
		try {
			const { candidates } = await checkDuplicates.mutateAsync({
				fullName: `${form.firstName} ${form.lastName}`,
				dateOfBirth: form.dateOfBirth,
				phone: form.phone || undefined,
			})
			if (candidates.length > 0) {
				setDuplicateCandidates(candidates)
				setShowDuplicateModal(true)
			} else {
				await doRegister()
			}
		} catch (err) {
			toast.error("Could not check duplicates", { description: (err as Error).message })
		}
	}

	async function doRegister() {
		try {
			const result = await register.mutateAsync({
				fullName: `${form.firstName} ${form.middleName ? form.middleName + " " : ""}${form.lastName}`,
				lastName: form.lastName,
				dateOfBirth: form.dateOfBirth,
				sexAtBirth: form.sexAtBirth as "male" | "female" | "other" | "prefer_not_to_say",
				ethnicity: form.ethnicity || undefined,
				address: form.street
					? { street: form.street, city: form.city, province: form.province, postalCode: form.postalCode }
					: undefined,
				email: form.email || undefined,
				phone: form.phone || undefined,
				emergencyContact: form.emergencyContactName
					? { name: form.emergencyContactName, relationship: "", phone: form.emergencyContactPhone }
					: undefined,
				hmoCardNumber: form.hmoCardNumber || undefined,
				hmoProvider: form.hmoProvider || undefined,
				consentDataProcessing: form.consentDataProcessing,
				consentCommunications: form.consentCommunications,
				consentServiceCategories: form.consentServiceCategories,
			})
			toast.success("Patient registered")
			router.push(SUPERVISOR_ROUTES.patientProfile(result.patientId))
		} catch (err) {
			toast.error("Registration failed", { description: (err as Error).message })
		}
	}

	return (
		<>
			<form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-6">
				<header>
					<h1 className="text-2xl font-bold">New Patient</h1>
					<p className="text-muted-foreground text-sm">Register a new patient record.</p>
				</header>

				<fieldset className="flex flex-col gap-3">
					<legend className="text-sm font-semibold">Personal Information</legend>
					<div className="grid gap-3 sm:grid-cols-2">
						<div className="flex flex-col gap-1">
							<Label htmlFor="reg-first">First name *</Label>
							<Input id="reg-first" required value={form.firstName} onChange={e => set("firstName", e.target.value)} />
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="reg-last">Last name *</Label>
							<Input id="reg-last" required value={form.lastName} onChange={e => set("lastName", e.target.value)} />
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="reg-mid">Middle name</Label>
							<Input id="reg-mid" value={form.middleName} onChange={e => set("middleName", e.target.value)} />
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="reg-dob">Date of birth *</Label>
							<Input id="reg-dob" type="date" required value={form.dateOfBirth} onChange={e => set("dateOfBirth", e.target.value)} />
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="reg-sex">Sex at birth *</Label>
							<Select value={form.sexAtBirth ?? ""} onValueChange={v => v && set("sexAtBirth", v)}>
								<SelectTrigger id="reg-sex"><SelectValue /></SelectTrigger>
								<SelectContent>
									<SelectItem value="male">Male</SelectItem>
									<SelectItem value="female">Female</SelectItem>
									<SelectItem value="other">Other</SelectItem>
									<SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="reg-eth">Ethnicity</Label>
							<Input id="reg-eth" value={form.ethnicity} onChange={e => set("ethnicity", e.target.value)} placeholder="e.g. Filipino" />
						</div>
					</div>
				</fieldset>

				<fieldset className="flex flex-col gap-3">
					<legend className="text-sm font-semibold">Contact</legend>
					<div className="grid gap-3 sm:grid-cols-2">
						<div className="flex flex-col gap-1">
							<Label htmlFor="reg-email">Email</Label>
							<Input id="reg-email" type="email" value={form.email} onChange={e => set("email", e.target.value)} />
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="reg-phone">Phone</Label>
							<Input id="reg-phone" value={form.phone} onChange={e => set("phone", e.target.value)} />
						</div>
						<div className="col-span-2 flex flex-col gap-1">
							<Label htmlFor="reg-street">Street address</Label>
							<Input id="reg-street" value={form.street} onChange={e => set("street", e.target.value)} />
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="reg-city">City</Label>
							<Input id="reg-city" value={form.city} onChange={e => set("city", e.target.value)} />
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="reg-prov">Province</Label>
							<Input id="reg-prov" value={form.province} onChange={e => set("province", e.target.value)} />
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="reg-postal">Postal code</Label>
							<Input id="reg-postal" value={form.postalCode} onChange={e => set("postalCode", e.target.value)} />
						</div>
					</div>
				</fieldset>

				<fieldset className="flex flex-col gap-3">
					<legend className="text-sm font-semibold">Emergency Contact</legend>
					<div className="grid gap-3 sm:grid-cols-2">
						<div className="flex flex-col gap-1">
							<Label htmlFor="reg-ec-name">Name</Label>
							<Input id="reg-ec-name" value={form.emergencyContactName} onChange={e => set("emergencyContactName", e.target.value)} />
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="reg-ec-phone">Phone</Label>
							<Input id="reg-ec-phone" value={form.emergencyContactPhone} onChange={e => set("emergencyContactPhone", e.target.value)} />
						</div>
					</div>
				</fieldset>

				<fieldset className="flex flex-col gap-3">
					<legend className="text-sm font-semibold">HMO Coverage</legend>
					<div className="grid gap-3 sm:grid-cols-2">
						<div className="flex flex-col gap-1">
							<Label htmlFor="reg-hmo-card">HMO card number</Label>
							<Input id="reg-hmo-card" value={form.hmoCardNumber} onChange={e => set("hmoCardNumber", e.target.value)} />
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="reg-hmo-prov">HMO provider</Label>
							<Input id="reg-hmo-prov" value={form.hmoProvider} onChange={e => set("hmoProvider", e.target.value)} />
						</div>
					</div>
				</fieldset>

				<fieldset className="flex flex-col gap-2">
					<legend className="text-sm font-semibold">Consent</legend>
					<label className="flex items-center gap-2 text-sm">
						<input type="checkbox" checked={form.consentDataProcessing} onChange={e => set("consentDataProcessing", e.target.checked)} className="size-4" />
						Consent to data processing
					</label>
					<label className="flex items-center gap-2 text-sm">
						<input type="checkbox" checked={form.consentCommunications} onChange={e => set("consentCommunications", e.target.checked)} className="size-4" />
						Consent to communications
					</label>
					<label className="flex items-center gap-2 text-sm">
						<input type="checkbox" checked={form.consentServiceCategories} onChange={e => set("consentServiceCategories", e.target.checked)} className="size-4" />
						Consent to specific service categories
					</label>
				</fieldset>

				<div className="flex gap-2">
					<Button type="submit" disabled={!isValid || checkDuplicates.isPending || register.isPending}>
						{checkDuplicates.isPending || register.isPending ? "Saving…" : "Register patient"}
					</Button>
					<Button type="button" variant="outline" onClick={() => router.back()}>
						Cancel
					</Button>
				</div>
			</form>

			<DuplicateDetectionModal
				open={showDuplicateModal}
				onOpenChange={setShowDuplicateModal}
				incoming={{ fullName: `${form.firstName} ${form.lastName}`, dateOfBirth: form.dateOfBirth, phone: form.phone }}
				candidates={duplicateCandidates}
				onUseExisting={patientId => {
					setShowDuplicateModal(false)
					router.push(SUPERVISOR_ROUTES.patientProfile(patientId))
				}}
				onMerge={patientId => {
					setShowDuplicateModal(false)
					router.push(SUPERVISOR_ROUTES.patientMerge(patientId))
				}}
				onCreateAnyway={() => {
					setShowDuplicateModal(false)
					doRegister()
				}}
			/>
		</>
	)
}
