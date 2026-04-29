"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card"
import { Checkbox } from "@/core/components/ui/checkbox"
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/core/components/ui/field"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/core/components/ui/select"
import { Separator } from "@/core/components/ui/separator"
import { Textarea } from "@/core/components/ui/textarea"

import { useRequestUploadsMutation, useSubmitLoaMutation } from "../api/loa.hooks"
import { SubmitSuccess } from "./submit-success"
import { UploadDropzone, type UploadFile } from "./upload-dropzone"

const RECORD_TYPE_OPTIONS = [
	{ value: "clinical_notes", label: "Clinical Notes" },
	{ value: "laboratory_results", label: "Laboratory Results" },
	{ value: "imaging", label: "Imaging / Radiology Reports" },
	{ value: "discharge_summary", label: "Discharge Summary" },
	{ value: "prescription", label: "Prescription Records" },
	{ value: "billing", label: "Billing / Financial Records" },
]

const DELIVERY_OPTIONS = [
	{ value: "email", label: "Email" },
	{ value: "mail", label: "Physical Mail" },
	{ value: "pickup", label: "In-Person Pickup" },
]

const ALLOWED_CONTENT_TYPES = ["application/pdf", "image/jpeg", "image/png"] as const
type AllowedContentType = (typeof ALLOWED_CONTENT_TYPES)[number]

interface LoaFormValues {
	visitDateFrom: string
	visitDateTo: string
	facilityLocation: string
	treatingProvider: string
	recordTypes: string[]
	deliveryMethod: string
	deliveryEmail: string
	deliveryAddress: string
	purposeOfRelease: string
	authorizedToName: string
	authorizedToRelationship: string
}

interface UploadSlot {
	kind: string
	label: string
	required: boolean
	file: UploadFile | null
}

type FieldErr = { message: string }
type FormErrors = Partial<Record<keyof LoaFormValues | "uploads", FieldErr>>

const INITIAL_SLOTS: UploadSlot[] = [
	{ kind: "government_id", label: "Government-Issued ID", required: true, file: null },
	{ kind: "authorization_letter", label: "Authorization Letter", required: true, file: null },
	{ kind: "proof_of_relationship", label: "Proof of Relationship (if applicable)", required: true, file: null },
	{ kind: "supporting_doc_1", label: "Supporting Document (optional)", required: false, file: null },
]

export function LoaForm() {
	const { mutateAsync: requestUploads } = useRequestUploadsMutation()
	const { mutateAsync: submitLoa, isPending: isSubmitting } = useSubmitLoaMutation()

	const [values, setValues] = useState<LoaFormValues>({
		visitDateFrom: "",
		visitDateTo: "",
		facilityLocation: "",
		treatingProvider: "",
		recordTypes: [],
		deliveryMethod: "",
		deliveryEmail: "",
		deliveryAddress: "",
		purposeOfRelease: "",
		authorizedToName: "",
		authorizedToRelationship: "",
	})
	const [errors, setErrors] = useState<FormErrors>({})
	const [slots, setSlots] = useState<UploadSlot[]>(INITIAL_SLOTS)
	const [successRef, setSuccessRef] = useState<string | null>(null)

	function set<K extends keyof LoaFormValues>(key: K, val: LoaFormValues[K]) {
		setValues(v => ({ ...v, [key]: val }))
		setErrors(e => ({ ...e, [key]: undefined }))
	}

	function toggleRecordType(value: string) {
		setValues(v => ({
			...v,
			recordTypes: v.recordTypes.includes(value)
				? v.recordTypes.filter(t => t !== value)
				: [...v.recordTypes, value],
		}))
		setErrors(e => ({ ...e, recordTypes: undefined }))
	}

	function updateSlot(index: number, file: UploadFile | null) {
		setSlots(s => s.map((slot, i) => (i === index ? { ...slot, file } : slot)))
		setErrors(e => ({ ...e, uploads: undefined }))
	}

	async function getPresignedUrl(
		_slotIndex: number,
		meta: { kind: string; filename: string; contentType: string; sizeBytes: number }
	) {
		const contentType = meta.contentType as AllowedContentType
		const result = await requestUploads({
			files: [{ kind: meta.kind, filename: meta.filename, contentType, sizeBytes: meta.sizeBytes }],
		})
		const upload = result.uploads[0]
		if (!upload) throw new Error("No upload URL returned")
		return { key: upload.key, url: upload.url }
	}

	function validate(): boolean {
		const next: FormErrors = {}

		if (!values.visitDateFrom) next.visitDateFrom = { message: "Visit start date is required" }
		if (!values.facilityLocation.trim()) next.facilityLocation = { message: "Facility / location is required" }
		if (values.recordTypes.length === 0) next.recordTypes = { message: "Select at least one record type" }
		if (!values.deliveryMethod) next.deliveryMethod = { message: "Delivery method is required" }
		if (values.deliveryMethod === "email" && !values.deliveryEmail.trim())
			next.deliveryEmail = { message: "Email address is required" }
		if (values.deliveryMethod === "mail" && !values.deliveryAddress.trim())
			next.deliveryAddress = { message: "Mailing address is required" }
		if (!values.purposeOfRelease.trim()) next.purposeOfRelease = { message: "Purpose of release is required" }

		const requiredSlots = slots.filter(s => s.required)
		const missingRequired = requiredSlots.some(s => !s.file || s.file.status !== "done")
		if (missingRequired) next.uploads = { message: "All three required documents must be uploaded" }

		const anyUploading = slots.some(s => s.file?.status === "uploading")
		if (anyUploading) next.uploads = { message: "Wait for all uploads to complete" }

		const anyError = slots.some(s => s.file?.status === "error")
		if (anyError) next.uploads = { message: "Fix upload errors before submitting" }

		setErrors(next)
		return Object.keys(next).length === 0
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (!validate()) return

		const attachments = slots
			.filter(s => s.file?.status === "done" && s.file.key)
			.map(s => ({
				kind: s.kind,
				key: s.file!.key!,
				filename: s.file!.file.name,
			}))

		try {
			const result = await submitLoa({
				payload: values as unknown as Record<string, unknown>,
				attachments,
			})
			setSuccessRef(result.caseRef)
		} catch {
			toast.error("Failed to submit request. Please try again.")
		}
	}

	if (successRef) {
		return <SubmitSuccess caseRef={successRef} />
	}

	const missingItems: string[] = []
	if (!values.visitDateFrom) missingItems.push("Visit date")
	if (!values.facilityLocation.trim()) missingItems.push("Facility location")
	if (values.recordTypes.length === 0) missingItems.push("Record types")
	if (!values.deliveryMethod) missingItems.push("Delivery method")
	if (!values.purposeOfRelease.trim()) missingItems.push("Purpose of release")
	slots.filter(s => s.required).forEach(s => {
		if (!s.file || s.file.status !== "done") missingItems.push(s.label)
	})

	const canSubmit = missingItems.length === 0 && !isSubmitting

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-6">
			{/* Section 1: Patient Identity */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">1. Patient Identity</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-sm">
						Your identity is pre-filled from your verified patient record. No additional input
						required.
					</p>
				</CardContent>
			</Card>

			{/* Section 2: Visit Details */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">2. Visit Details</CardTitle>
				</CardHeader>
				<CardContent>
					<FieldGroup>
						<div className="grid gap-4 sm:grid-cols-2">
							<Field data-invalid={!!errors.visitDateFrom}>
								<FieldLabel htmlFor="visitDateFrom">Visit Date (From) *</FieldLabel>
								<Input
									id="visitDateFrom"
									type="date"
									value={values.visitDateFrom}
									onChange={e => set("visitDateFrom", e.target.value)}
									aria-invalid={!!errors.visitDateFrom}
									disabled={isSubmitting}
								/>
								{errors.visitDateFrom && <FieldError errors={[errors.visitDateFrom]} />}
							</Field>

							<Field>
								<FieldLabel htmlFor="visitDateTo">Visit Date (To)</FieldLabel>
								<Input
									id="visitDateTo"
									type="date"
									value={values.visitDateTo}
									onChange={e => set("visitDateTo", e.target.value)}
									disabled={isSubmitting}
								/>
							</Field>
						</div>

						<Field data-invalid={!!errors.facilityLocation}>
							<FieldLabel htmlFor="facilityLocation">Facility / Location *</FieldLabel>
							<Input
								id="facilityLocation"
								value={values.facilityLocation}
								onChange={e => set("facilityLocation", e.target.value)}
								placeholder="e.g. Quirino Memorial Medical Center"
								aria-invalid={!!errors.facilityLocation}
								disabled={isSubmitting}
							/>
							{errors.facilityLocation && <FieldError errors={[errors.facilityLocation]} />}
						</Field>

						<Field>
							<FieldLabel htmlFor="treatingProvider">Treating Provider (optional)</FieldLabel>
							<Input
								id="treatingProvider"
								value={values.treatingProvider}
								onChange={e => set("treatingProvider", e.target.value)}
								placeholder="Name of physician / provider"
								disabled={isSubmitting}
							/>
						</Field>

						<Field data-invalid={!!errors.recordTypes}>
							<FieldLabel>Records Requested *</FieldLabel>
							<div className="grid gap-2 sm:grid-cols-2">
								{RECORD_TYPE_OPTIONS.map(opt => (
									<div key={opt.value} className="flex items-center gap-2">
										<Checkbox
											id={`rt-${opt.value}`}
											checked={values.recordTypes.includes(opt.value)}
											onCheckedChange={() => toggleRecordType(opt.value)}
											disabled={isSubmitting}
										/>
										<Label htmlFor={`rt-${opt.value}`} className="cursor-pointer text-sm">
											{opt.label}
										</Label>
									</div>
								))}
							</div>
							{errors.recordTypes && <FieldError errors={[errors.recordTypes]} />}
						</Field>

						<Field data-invalid={!!errors.deliveryMethod}>
							<FieldLabel htmlFor="deliveryMethod">Delivery Method *</FieldLabel>
							<Select
								value={values.deliveryMethod || undefined}
								onValueChange={val => set("deliveryMethod", val ?? "")}
								disabled={isSubmitting}
							>
								<SelectTrigger id="deliveryMethod">
									<SelectValue>
										{values.deliveryMethod
											? (DELIVERY_OPTIONS.find(o => o.value === values.deliveryMethod)?.label ?? "")
											: "Select delivery method"}
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									{DELIVERY_OPTIONS.map(opt => (
										<SelectItem key={opt.value} value={opt.value}>
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.deliveryMethod && <FieldError errors={[errors.deliveryMethod]} />}
						</Field>

						{values.deliveryMethod === "email" && (
							<Field data-invalid={!!errors.deliveryEmail}>
								<FieldLabel htmlFor="deliveryEmail">Email Address *</FieldLabel>
								<Input
									id="deliveryEmail"
									type="email"
									value={values.deliveryEmail}
									onChange={e => set("deliveryEmail", e.target.value)}
									placeholder="recipient@example.com"
									aria-invalid={!!errors.deliveryEmail}
									disabled={isSubmitting}
								/>
								{errors.deliveryEmail && <FieldError errors={[errors.deliveryEmail]} />}
							</Field>
						)}

						{values.deliveryMethod === "mail" && (
							<Field data-invalid={!!errors.deliveryAddress}>
								<FieldLabel htmlFor="deliveryAddress">Mailing Address *</FieldLabel>
								<Textarea
									id="deliveryAddress"
									value={values.deliveryAddress}
									onChange={e => set("deliveryAddress", e.target.value)}
									placeholder="Full mailing address"
									rows={3}
									aria-invalid={!!errors.deliveryAddress}
									disabled={isSubmitting}
								/>
								{errors.deliveryAddress && <FieldError errors={[errors.deliveryAddress]} />}
							</Field>
						)}

						<Field data-invalid={!!errors.purposeOfRelease}>
							<FieldLabel htmlFor="purposeOfRelease">Purpose of Release *</FieldLabel>
							<Textarea
								id="purposeOfRelease"
								value={values.purposeOfRelease}
								onChange={e => set("purposeOfRelease", e.target.value)}
								placeholder="Explain why you are requesting these records"
								rows={3}
								aria-invalid={!!errors.purposeOfRelease}
								disabled={isSubmitting}
							/>
							{errors.purposeOfRelease && <FieldError errors={[errors.purposeOfRelease]} />}
						</Field>

						<Separator />

						<p className="text-muted-foreground text-sm font-medium">
							Authorized Recipient (if applicable)
						</p>

						<Field>
							<FieldLabel htmlFor="authorizedToName">Authorized Person Name</FieldLabel>
							<Input
								id="authorizedToName"
								value={values.authorizedToName}
								onChange={e => set("authorizedToName", e.target.value)}
								placeholder="Full name"
								disabled={isSubmitting}
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor="authorizedToRelationship">Relationship to Patient</FieldLabel>
							<Input
								id="authorizedToRelationship"
								value={values.authorizedToRelationship}
								onChange={e => set("authorizedToRelationship", e.target.value)}
								placeholder="e.g. Spouse, Parent, Legal Guardian"
								disabled={isSubmitting}
							/>
						</Field>
					</FieldGroup>
				</CardContent>
			</Card>

			{/* Section 3: Required Documents */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">3. Required Documents</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					{slots.map((slot, i) => (
						<div key={slot.kind}>
							<p className="mb-2 text-sm font-medium">
								{slot.label}
								{slot.required && <span className="text-destructive ml-1">*</span>}
							</p>
							<UploadDropzone
								kind={slot.kind}
								label={`Upload ${slot.label}`}
								file={slot.file}
								getPresignedUrl={meta => getPresignedUrl(i, meta)}
								onChange={file => updateSlot(i, file)}
								disabled={isSubmitting}
							/>
						</div>
					))}
					{errors.uploads && (
						<p className="text-destructive text-sm">{errors.uploads.message}</p>
					)}
				</CardContent>
			</Card>

			{/* Section 4: Review & Submit */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">4. Review & Submit</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					{missingItems.length > 0 && (
						<div className="bg-muted rounded-md p-4">
							<p className="mb-2 text-sm font-medium">Complete the following before submitting:</p>
							<ul className="text-muted-foreground space-y-1 text-sm">
								{missingItems.map(item => (
									<li key={item} className="flex items-center gap-2">
										<span className="bg-muted-foreground/30 size-1.5 rounded-full" />
										{item}
									</li>
								))}
							</ul>
						</div>
					)}

					<Button type="submit" disabled={!canSubmit} className="w-full">
						{isSubmitting ? "Submitting..." : "Submit LOA Request"}
					</Button>
				</CardContent>
			</Card>
		</form>
	)
}
