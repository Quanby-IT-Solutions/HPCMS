"use client"

import { useState } from "react"

import { Input } from "@/core/components/ui/input"
import { Textarea } from "@/core/components/ui/textarea"
import { PortalAlert } from "@/features/portal-shared/components/portal-alert"
import { PortalField } from "@/features/portal-shared/components/portal-field"
import { PortalForm } from "@/features/portal-shared/components/portal-form"
import { PortalUploadDropzone } from "@/features/portal-shared/components/portal-upload-dropzone"
import type { UploadFile } from "@/features/portal-loa/components/upload-dropzone"

export default function PortalDesignShowcasePage() {
	const [name, setName] = useState("")
	const [demoUpload, setDemoUpload] = useState<UploadFile | null>(null)
	return (
		<div className="flex flex-col gap-10">
			<header>
				<h1 className="text-2xl font-bold">Portal design showcase</h1>
				<p className="text-muted-foreground text-sm">
					PAT-FE-02 primitives — base typography ≥ 16px, WCAG AA contrast, keyboard-reachable.
				</p>
			</header>

			<section className="flex flex-col gap-3">
				<h2 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
					PortalAlert
				</h2>
				<PortalAlert
					variant="info"
					title="Heads up"
					description="Use this for informational announcements (verification reminders, scheduled maintenance, etc.)."
				/>
				<PortalAlert
					variant="success"
					title="Saved"
					description="Use for confirmation states like “LOA submitted successfully.”"
				/>
				<PortalAlert
					variant="warning"
					title="Action required"
					description="Use for soft warnings like missing identity verification."
				/>
				<PortalAlert
					variant="error"
					title="Could not submit"
					description="Use for hard failures the patient must act on."
				/>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
					PortalUploadDropzone
				</h2>
				<div className="max-w-lg">
					<PortalUploadDropzone
						kind="demo"
						label="Drop a sample file"
						file={demoUpload}
						getPresignedUrl={async meta => ({
							key: `demo-${meta.filename}`,
							url: "https://example.invalid/upload",
						})}
						onChange={setDemoUpload}
					/>
				</div>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
					PortalForm + PortalField
				</h2>
				<PortalForm onSubmit={e => e.preventDefault()} className="max-w-lg">
					<PortalField
						label="Full name"
						htmlFor="demo-name"
						hint="As it appears on your ID."
						required
					>
						<Input
							id="demo-name"
							value={name}
							onChange={e => setName(e.target.value)}
							placeholder="Maria Santos"
						/>
					</PortalField>
					<PortalField
						label="Reason for request"
						htmlFor="demo-reason"
						error={name.length > 0 && name.length < 2 ? "Name is too short." : null}
					>
						<Textarea id="demo-reason" rows={4} placeholder="Briefly describe…" />
					</PortalField>
				</PortalForm>
			</section>
		</div>
	)
}
