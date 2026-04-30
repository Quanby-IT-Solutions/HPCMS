"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card"
import { Input } from "@/core/components/ui/input"
import { Textarea } from "@/core/components/ui/textarea"
import { PortalAlert } from "@/features/portal-shared/components/portal-alert"
import { PortalField } from "@/features/portal-shared/components/portal-field"
import { PortalForm } from "@/features/portal-shared/components/portal-form"

import { useRequestUploadsMutation, useSubmitLoaMutation } from "../api/loa.hooks"
import { UploadDropzone, type UploadFile } from "./upload-dropzone"

type AllowedContentType = "application/pdf" | "image/jpeg" | "image/png"

interface LoaFormValues {
	hmoCardNumber: string
	consultationDate: string
	preferredDoctor: string
	chiefComplaint: string
}

interface UploadSlot {
	kind: string
	label: string
	required: boolean
	file: UploadFile | null
}

const INITIAL_SLOTS: UploadSlot[] = [
	{ kind: "admitting_order", label: "Admitting Order", required: true, file: null },
	{ kind: "valid_id", label: "Valid Government ID", required: true, file: null },
	{ kind: "hmo_id", label: "HMO ID", required: true, file: null },
]

type FormStep = "form" | "review"

type FieldErrors = Partial<Record<keyof LoaFormValues | "uploads", string>>

export function LoaForm() {
	const router = useRouter()
	const { mutateAsync: requestUploads } = useRequestUploadsMutation()
	const { mutateAsync: submitLoa, isPending: isSubmitting } = useSubmitLoaMutation()

	const [step, setStep] = useState<FormStep>("form")
	const [values, setValues] = useState<LoaFormValues>({
		hmoCardNumber: "",
		consultationDate: "",
		preferredDoctor: "",
		chiefComplaint: "",
	})
	const [slots, setSlots] = useState<UploadSlot[]>(INITIAL_SLOTS)
	const [errors, setErrors] = useState<FieldErrors>({})

	function set<K extends keyof LoaFormValues>(key: K, val: LoaFormValues[K]) {
		setValues(v => ({ ...v, [key]: val }))
		setErrors(prev => ({ ...prev, [key]: undefined }))
	}

	function updateSlot(index: number, file: UploadFile | null) {
		setSlots(s => s.map((slot, i) => (i === index ? { ...slot, file } : slot)))
		setErrors(prev => ({ ...prev, uploads: undefined }))
	}

	async function getPresignedUrl(meta: {
		kind: string
		filename: string
		contentType: string
		sizeBytes: number
	}) {
		const contentType = meta.contentType as AllowedContentType
		const result = await requestUploads({
			files: [
				{
					kind: meta.kind,
					filename: meta.filename,
					contentType,
					sizeBytes: meta.sizeBytes,
				},
			],
		})
		const upload = result.uploads[0]
		if (!upload) throw new Error("No upload URL returned")
		return { key: upload.key, url: upload.url }
	}

	function validate(): boolean {
		const next: FieldErrors = {}
		if (!values.hmoCardNumber.trim())
			next.hmoCardNumber = "HMO card number is required."
		if (!values.consultationDate)
			next.consultationDate = "Consultation/procedure date is required."
		if (!values.preferredDoctor.trim())
			next.preferredDoctor = "Preferred doctor is required."
		if (values.chiefComplaint.trim().length < 5)
			next.chiefComplaint = "Briefly describe the chief complaint."

		const requiredMissing = slots.some(s => s.required && (!s.file || s.file.status !== "done"))
		if (requiredMissing) next.uploads = "All three required documents must be uploaded."
		const anyUploading = slots.some(s => s.file?.status === "uploading")
		if (anyUploading) next.uploads = "Wait for all uploads to complete."
		const anyError = slots.some(s => s.file?.status === "error")
		if (anyError) next.uploads = "Fix upload errors before submitting."

		setErrors(next)
		return Object.keys(next).length === 0
	}

	function handleReview(e: React.FormEvent) {
		e.preventDefault()
		if (!validate()) return
		setStep("review")
	}

	async function handleSubmit() {
		if (!validate()) {
			setStep("form")
			return
		}
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
			router.push(`/portal/loa/${result.caseRef}/confirmation`)
		} catch (err) {
			toast.error("Failed to submit request. Please try again.", {
				description: (err as Error).message,
			})
		}
	}

	if (step === "review") {
		return (
			<div className="flex flex-col gap-6">
				<PortalAlert
					variant="info"
					title="Review your submission"
					description="Make sure the information below is correct. You can go back to edit before submitting."
				/>

				<Card>
					<CardHeader>
						<CardTitle className="text-base">Your details</CardTitle>
					</CardHeader>
					<CardContent>
						<dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
							<div>
								<dt className="text-muted-foreground text-[11px] uppercase">
									HMO card number
								</dt>
								<dd className="font-medium">{values.hmoCardNumber}</dd>
							</div>
							<div>
								<dt className="text-muted-foreground text-[11px] uppercase">
									Consultation date
								</dt>
								<dd className="font-medium">{values.consultationDate}</dd>
							</div>
							<div>
								<dt className="text-muted-foreground text-[11px] uppercase">
									Preferred doctor
								</dt>
								<dd className="font-medium">{values.preferredDoctor}</dd>
							</div>
							<div className="sm:col-span-2">
								<dt className="text-muted-foreground text-[11px] uppercase">
									Chief complaint
								</dt>
								<dd className="whitespace-pre-wrap">{values.chiefComplaint}</dd>
							</div>
							<div className="sm:col-span-2">
								<dt className="text-muted-foreground text-[11px] uppercase">
									Attached documents
								</dt>
								<ul className="mt-1 list-disc pl-4">
									{slots.map(s => (
										<li key={s.kind}>
											{s.label} — {s.file?.file.name ?? "missing"}
										</li>
									))}
								</ul>
							</div>
						</dl>
					</CardContent>
				</Card>

				<div className="flex items-center justify-between">
					<Button variant="outline" onClick={() => setStep("form")} disabled={isSubmitting}>
						Edit answers
					</Button>
					<Button onClick={handleSubmit} disabled={isSubmitting}>
						{isSubmitting ? "Submitting…" : "Submit LOA request"}
					</Button>
				</div>
			</div>
		)
	}

	return (
		<PortalForm onSubmit={handleReview} className="gap-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Your details</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<PortalField
						label="HMO Card Number"
						htmlFor="hmoCardNumber"
						required
						error={errors.hmoCardNumber ?? null}
					>
						<Input
							id="hmoCardNumber"
							value={values.hmoCardNumber}
							onChange={e => set("hmoCardNumber", e.target.value)}
							placeholder="e.g. PHIC-12-1234567-8"
							disabled={isSubmitting}
						/>
					</PortalField>
					<PortalField
						label="Date of Consultation / Procedure"
						htmlFor="consultationDate"
						required
						error={errors.consultationDate ?? null}
					>
						<Input
							id="consultationDate"
							type="date"
							value={values.consultationDate}
							onChange={e => set("consultationDate", e.target.value)}
							disabled={isSubmitting}
						/>
					</PortalField>
					<PortalField
						label="Preferred Doctor Name"
						htmlFor="preferredDoctor"
						required
						hint="Type the doctor's full name. Practitioner suggestions land with PAT-BE-04."
						error={errors.preferredDoctor ?? null}
					>
						<Input
							id="preferredDoctor"
							value={values.preferredDoctor}
							onChange={e => set("preferredDoctor", e.target.value)}
							placeholder="Dr. Antonio Reyes"
							disabled={isSubmitting}
						/>
					</PortalField>
					<PortalField
						label="Chief Complaint"
						htmlFor="chiefComplaint"
						required
						error={errors.chiefComplaint ?? null}
					>
						<Textarea
							id="chiefComplaint"
							value={values.chiefComplaint}
							onChange={e => set("chiefComplaint", e.target.value)}
							rows={4}
							maxLength={2000}
							placeholder="Brief description of why the consultation/procedure is needed."
							disabled={isSubmitting}
						/>
					</PortalField>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Required documents</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					{slots.map((slot, i) => (
						<div key={slot.kind}>
							<p className="mb-2 text-sm font-medium">
								{slot.label}
								{slot.required ? <span className="text-destructive ml-1">*</span> : null}
							</p>
							<UploadDropzone
								kind={slot.kind}
								label={`Upload ${slot.label}`}
								file={slot.file}
								getPresignedUrl={meta => getPresignedUrl(meta)}
								onChange={file => updateSlot(i, file)}
								disabled={isSubmitting}
							/>
						</div>
					))}
					{errors.uploads ? (
						<p className="text-destructive text-sm">{errors.uploads}</p>
					) : null}
				</CardContent>
			</Card>

			<div className="flex justify-end">
				<Button type="submit">Review submission</Button>
			</div>
		</PortalForm>
	)
}
