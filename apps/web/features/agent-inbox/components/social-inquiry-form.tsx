"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
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
import { Textarea } from "@/core/components/ui/textarea"
import { orpc } from "@/services/orpc/client"

const PLATFORMS = [
	{ value: "facebook", label: "Facebook" },
	{ value: "twitter", label: "X (Twitter)" },
	{ value: "instagram", label: "Instagram" },
	{ value: "other", label: "Other" },
]

const ISSUES = [
	{ value: "complaint", label: "Complaint" },
	{ value: "inquiry", label: "Inquiry" },
	{ value: "compliment", label: "Compliment" },
	{ value: "misinformation", label: "Misinformation" },
	{ value: "other", label: "Other" },
]

interface CapturedInquiry {
	inboxItemId: string
	caseRef: string | null
	platform: string
	isAnonymous: boolean
	patientId: string | null
}

export function SocialInquiryForm() {
	const router = useRouter()
	const queryClient = useQueryClient()
	const [platform, setPlatform] = useState("facebook")
	const [postUrl, setPostUrl] = useState("")
	const [authorHandle, setAuthorHandle] = useState("")
	const [content, setContent] = useState("")
	const [isAnonymous, setIsAnonymous] = useState(true)
	const [patientId, setPatientId] = useState("")
	const [issue, setIssue] = useState("inquiry")
	const [captured, setCaptured] = useState<CapturedInquiry | null>(null)

	const { mutate, isPending } = useMutation(
		orpc.channels.social.capture.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.inbox.list.key() })
			},
		})
	)

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (content.trim().length === 0 || authorHandle.trim().length === 0) return
		mutate(
			{
				platform: platform as "facebook",
				postUrl: postUrl.trim() ? postUrl.trim() : null,
				authorHandle: authorHandle.trim(),
				content: content.trim(),
				patientId: !isAnonymous && patientId.trim() ? patientId.trim() : null,
				isAnonymous,
				issueCategory: issue as "inquiry",
				capturedAt: new Date().toISOString(),
			},
			{
				onSuccess: result => {
					toast.success("Social inquiry captured")
					setCaptured({
						inboxItemId: result.inboxItemId,
						caseRef: result.caseRef,
						platform,
						isAnonymous,
						patientId: !isAnonymous && patientId.trim() ? patientId.trim() : null,
					})
				},
				onError: err => {
					toast.error("Could not capture", { description: (err as Error).message })
				},
			}
		)
	}

	if (captured) {
		const params = new URLSearchParams({ source: "social_media" })
		params.set("platform", captured.platform)
		params.set("inboxItemId", captured.inboxItemId)
		if (captured.patientId) params.set("createForPatient", captured.patientId)
		if (captured.isAnonymous) params.set("anonymous", "1")
		return (
			<div className="flex max-w-2xl flex-col gap-3 rounded-md border p-4">
				<h2 className="text-base font-semibold">Inquiry captured</h2>
				<p className="text-muted-foreground text-sm">
					The inquiry is now in the unified inbox. You can promote it to a case now or
					triage from the inbox later.
				</p>
				<div className="flex flex-wrap gap-2">
					<a
						href={`/agent/cases?${params.toString()}`}
						className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium"
					>
						Create case from inquiry
					</a>
					<button
						type="button"
						onClick={() => router.push("/agent/inbox")}
						className="border-border hover:bg-muted inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium"
					>
						Back to inbox
					</button>
					<button
						type="button"
						onClick={() => {
							setCaptured(null)
							setContent("")
							setAuthorHandle("")
							setPostUrl("")
						}}
						className="text-muted-foreground hover:text-foreground inline-flex items-center px-3 py-1.5 text-xs"
					>
						Capture another
					</button>
				</div>
			</div>
		)
	}

	return (
		<form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-3">
			<div className="grid gap-3 sm:grid-cols-2">
				<div className="flex flex-col gap-1">
					<Label htmlFor="platform">Platform</Label>
					<Select value={platform} onValueChange={v => setPlatform(v ?? "facebook")}>
						<SelectTrigger id="platform">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{PLATFORMS.map(p => (
								<SelectItem key={p.value} value={p.value}>
									{p.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-1">
					<Label htmlFor="issue">Issue category</Label>
					<Select value={issue} onValueChange={v => setIssue(v ?? "inquiry")}>
						<SelectTrigger id="issue">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{ISSUES.map(i => (
								<SelectItem key={i.value} value={i.value}>
									{i.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-1">
					<Label htmlFor="handle">Author handle</Label>
					<Input
						id="handle"
						value={authorHandle}
						onChange={e => setAuthorHandle(e.target.value)}
						placeholder="@username"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label htmlFor="post-url">Post URL (optional)</Label>
					<Input
						id="post-url"
						value={postUrl}
						onChange={e => setPostUrl(e.target.value)}
						placeholder="https://…"
					/>
				</div>
			</div>

			<label className="text-foreground inline-flex items-center gap-2 text-xs font-medium">
				<input
					type="checkbox"
					checked={isAnonymous}
					onChange={e => setIsAnonymous(e.target.checked)}
				/>
				Anonymous (no patient linkage)
			</label>

			{!isAnonymous ? (
				<div className="flex flex-col gap-1">
					<Label htmlFor="patient">Patient ID</Label>
					<Input
						id="patient"
						value={patientId}
						onChange={e => setPatientId(e.target.value)}
						placeholder="patient-uuid"
					/>
				</div>
			) : null}

			<div className="flex flex-col gap-1">
				<Label htmlFor="content">Content</Label>
				<Textarea
					id="content"
					rows={5}
					value={content}
					onChange={e => setContent(e.target.value)}
					maxLength={5000}
					placeholder="Paste the post content here…"
				/>
			</div>

			<div className="flex justify-end">
				<Button
					type="submit"
					disabled={
						content.trim().length === 0 || authorHandle.trim().length === 0 || isPending
					}
				>
					{isPending ? "Capturing…" : "Capture inquiry"}
				</Button>
			</div>
		</form>
	)
}
