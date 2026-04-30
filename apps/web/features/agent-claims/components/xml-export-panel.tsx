"use client"

import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/core/components/ui/button"
import { useGenerateXmlMutation } from "@/features/agent-claims/api/claims.hooks"

interface Props {
	claimId: string
}

export function XmlExportPanel({ claimId }: Props) {
	const cf5 = useGenerateXmlMutation("cf5")
	const esoa = useGenerateXmlMutation("esoa")
	const [errors, setErrors] = useState<Array<{ code: string; message: string }>>([])

	async function handle(kind: "cf5" | "esoa") {
		const fn = kind === "cf5" ? cf5 : esoa
		try {
			const result = await fn.mutateAsync({ claimId })
			setErrors(result.validationErrors)
			if (result.validationErrors.length > 0) {
				toast.error(`${kind.toUpperCase()} validation failed`)
			} else {
				toast.success(`${kind.toUpperCase()} XML generated`)
			}
		} catch (err) {
			toast.error("Generation failed", { description: (err as Error).message })
		}
	}

	return (
		<div className="flex flex-col gap-3 rounded-md border p-4">
			<h2 className="text-sm font-semibold">PhilHealth XML export</h2>
			<div className="flex flex-wrap gap-2">
				<Button size="sm" onClick={() => handle("cf5")} disabled={cf5.isPending}>
					{cf5.isPending ? "Generating…" : "Generate CF5"}
				</Button>
				<Button size="sm" onClick={() => handle("esoa")} disabled={esoa.isPending}>
					{esoa.isPending ? "Generating…" : "Generate eSOA"}
				</Button>
				<Link
					href={`/agent/claims/${claimId}/export/cf5`}
					className="border-border hover:bg-muted text-muted-foreground inline-flex items-center rounded-md border px-2.5 py-1.5 text-xs font-medium"
				>
					Preview CF5
				</Link>
				<Link
					href={`/agent/claims/${claimId}/export/esoa`}
					className="border-border hover:bg-muted text-muted-foreground inline-flex items-center rounded-md border px-2.5 py-1.5 text-xs font-medium"
				>
					Preview eSOA
				</Link>
			</div>
			{errors.length > 0 ? (
				<ul className="text-destructive flex flex-col gap-1 text-xs">
					{errors.map((e, i) => (
						<li key={i}>
							<code className="mr-1">{e.code}</code> {e.message}
						</li>
					))}
				</ul>
			) : null}
		</div>
	)
}
