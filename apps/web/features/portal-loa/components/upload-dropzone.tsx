"use client"

import { useCallback, useRef, useState } from "react"
import { CheckCircle, FileText, Loader2, RotateCcw, Upload, X } from "@/core/components/icons"

import { Button } from "@/core/components/ui/button"
import { cn } from "@/core/lib/utils"

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"] as const
const MAX_SIZE_BYTES = 10 * 1024 * 1024

export type UploadStatus = "idle" | "uploading" | "done" | "error"

export interface UploadFile {
	file: File
	status: UploadStatus
	progress: number
	key?: string
	error?: string
}

interface UploadDropzoneProps {
	kind: string
	label: string
	file: UploadFile | null
	getPresignedUrl: (meta: {
		kind: string
		filename: string
		contentType: string
		sizeBytes: number
	}) => Promise<{ key: string; url: string }>
	onChange: (file: UploadFile | null) => void
	disabled?: boolean
}

export function UploadDropzone({
	kind,
	label,
	file,
	getPresignedUrl,
	onChange,
	disabled,
}: UploadDropzoneProps) {
	const inputRef = useRef<HTMLInputElement>(null)
	const [dragging, setDragging] = useState(false)

	const handleFile = useCallback(
		async (raw: File) => {
			if (!ALLOWED_TYPES.includes(raw.type as (typeof ALLOWED_TYPES)[number])) {
				onChange({
					file: raw,
					status: "error",
					progress: 0,
					error: "Only PDF, JPEG, and PNG files are allowed",
				})
				return
			}
			if (raw.size > MAX_SIZE_BYTES) {
				onChange({
					file: raw,
					status: "error",
					progress: 0,
					error: "File exceeds 10 MB limit",
				})
				return
			}

			const pending: UploadFile = { file: raw, status: "uploading", progress: 0 }
			onChange(pending)

			try {
				const { key, url } = await getPresignedUrl({
					kind,
					filename: raw.name,
					contentType: raw.type,
					sizeBytes: raw.size,
				})

				await new Promise<void>((resolve, reject) => {
					const xhr = new XMLHttpRequest()
					xhr.open("PUT", url)
					xhr.setRequestHeader("Content-Type", raw.type)
					xhr.upload.addEventListener("progress", ev => {
						if (ev.lengthComputable) {
							onChange({ file: raw, status: "uploading", progress: (ev.loaded / ev.total) * 100 })
						}
					})
					xhr.addEventListener("load", () => {
						if (xhr.status >= 200 && xhr.status < 300) resolve()
						else reject(new Error(`Upload failed: ${xhr.status}`))
					})
					xhr.addEventListener("error", () => reject(new Error("Upload failed")))
					xhr.send(raw)
				})

				onChange({ file: raw, status: "done", progress: 100, key })
			} catch (err) {
				onChange({
					file: raw,
					status: "error",
					progress: 0,
					error: err instanceof Error ? err.message : "Upload failed",
				})
			}
		},
		[kind, getPresignedUrl, onChange]
	)

	function handleDrop(e: React.DragEvent) {
		e.preventDefault()
		setDragging(false)
		const dropped = e.dataTransfer.files[0]
		if (dropped) void handleFile(dropped)
	}

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const picked = e.target.files?.[0]
		if (picked) void handleFile(picked)
		e.target.value = ""
	}

	if (file) {
		return (
			<div className="border-border flex items-center gap-3 rounded-md border p-3">
				<FileText className="text-muted-foreground size-5 shrink-0" />
				<div className="min-w-0 flex-1">
					<p className="truncate text-sm font-medium">{file.file.name}</p>
					{file.status === "uploading" && (
						<div className="mt-1 flex items-center gap-2">
							<Loader2 className="size-3 animate-spin" />
							<span className="text-muted-foreground text-xs">{Math.round(file.progress)}%</span>
						</div>
					)}
					{file.status === "done" && (
						<div className="mt-1 flex items-center gap-1 text-green-600">
							<CheckCircle className="size-3" />
							<span className="text-xs">Uploaded</span>
						</div>
					)}
					{file.status === "error" && (
						<p className="text-destructive mt-1 text-xs">{file.error}</p>
					)}
				</div>
				{file.status === "error" && (
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={() => inputRef.current?.click()}
						disabled={disabled}
					>
						<RotateCcw className="size-4" />
					</Button>
				)}
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={() => onChange(null)}
					disabled={disabled || file.status === "uploading"}
				>
					<X className="size-4" />
				</Button>
				<input ref={inputRef} type="file" className="hidden" onChange={handleInputChange} />
			</div>
		)
	}

	return (
		<div
			className={cn(
				"border-border hover:border-primary flex cursor-pointer flex-col items-center gap-2 rounded-md border-2 border-dashed p-6 transition-colors",
				dragging && "border-primary bg-primary/5",
				disabled && "cursor-not-allowed opacity-50"
			)}
			onClick={() => !disabled && inputRef.current?.click()}
			onDragOver={e => {
				e.preventDefault()
				setDragging(true)
			}}
			onDragLeave={() => setDragging(false)}
			onDrop={handleDrop}
			role="button"
			tabIndex={0}
			onKeyDown={e => e.key === "Enter" && !disabled && inputRef.current?.click()}
		>
			<Upload className="text-muted-foreground size-6" />
			<p className="text-sm font-medium">{label}</p>
			<p className="text-muted-foreground text-xs">PDF, JPEG, PNG up to 10 MB</p>
			<input
				ref={inputRef}
				type="file"
				className="hidden"
				accept=".pdf,.jpg,.jpeg,.png"
				onChange={handleInputChange}
				disabled={disabled}
			/>
		</div>
	)
}
