"use client"

import { useMemo, useState } from "react"

import { Button } from "@/core/components/ui/button"
import { Skeleton } from "@/core/components/ui/skeleton"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/core/components/ui/table"
import { useXmlPreviewQuery } from "@/features/agent-claims/api/claims.hooks"

interface Props {
	claimId: string
	kind: "cf5" | "esoa"
}

interface AuditEntry {
	id: string
	action: string
	actor: string
	at: Date
	hash: string
}

interface XmlNode {
	name: string
	attributes: Record<string, string>
	text: string | null
	children: XmlNode[]
}

function parseXml(raw: string): XmlNode | null {
	if (typeof window === "undefined") return null
	try {
		const doc = new DOMParser().parseFromString(raw, "application/xml")
		if (doc.getElementsByTagName("parsererror").length > 0) return null
		const root = doc.documentElement
		const walk = (el: Element): XmlNode => {
			const attributes: Record<string, string> = {}
			for (const attr of Array.from(el.attributes)) {
				attributes[attr.name] = attr.value
			}
			const childElements = Array.from(el.children)
			const text = childElements.length === 0 ? (el.textContent?.trim() || null) : null
			return {
				name: el.tagName,
				attributes,
				text,
				children: childElements.map(walk),
			}
		}
		return walk(root)
	} catch {
		return null
	}
}

function StructuredNode({ node, depth = 0 }: { node: XmlNode; depth?: number }) {
	return (
		<div
			className="border-border/60 ml-2 border-l pl-3"
			style={{ marginLeft: depth === 0 ? 0 : undefined }}
		>
			<div className="flex flex-wrap items-baseline gap-2 text-xs">
				<span className="text-primary font-mono font-semibold">{node.name}</span>
				{Object.entries(node.attributes).map(([k, v]) => (
					<span key={k} className="text-muted-foreground font-mono">
						{k}=
						<span className="text-foreground">&quot;{v}&quot;</span>
					</span>
				))}
				{node.text ? <span className="text-foreground">{node.text}</span> : null}
			</div>
			{node.children.length > 0 ? (
				<div className="flex flex-col gap-1">
					{node.children.map((c, i) => (
						<StructuredNode key={`${c.name}-${i}`} node={c} depth={depth + 1} />
					))}
				</div>
			) : null}
		</div>
	)
}

function buildMockAudit(claimId: string, kind: string, currentHash: string): AuditEntry[] {
	return [
		{
			id: `audit-${claimId}-1`,
			action: `${kind.toUpperCase()} generated`,
			actor: "agent@hpcms.local",
			at: new Date(Date.now() - 5 * 60 * 1000),
			hash: currentHash,
		},
		{
			id: `audit-${claimId}-2`,
			action: `${kind.toUpperCase()} generated`,
			actor: "agent@hpcms.local",
			at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
			hash: "stub-sha256-prev-9988aabb",
		},
	]
}

export function XmlPreviewPage({ claimId, kind }: Props) {
	const { data, isLoading } = useXmlPreviewQuery(claimId)
	const [showRaw, setShowRaw] = useState(false)

	const tree = useMemo(() => (data ? parseXml(data.xml) : null), [data])
	const hasErrors = (data?.validationErrors.length ?? 0) > 0

	function download() {
		if (!data || hasErrors) return
		const blob = new Blob([data.xml], { type: "application/xml" })
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		a.download = `${kind}-${claimId}.xml`
		a.click()
		URL.revokeObjectURL(url)
	}

	if (isLoading || !data) {
		return <Skeleton className="h-64 w-full" />
	}

	const auditEntries = buildMockAudit(claimId, kind, data.hash)

	return (
		<div className="flex flex-col gap-4">
			<header className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">
						{kind === "cf5" ? "CF5 XML preview" : "eSOA XML preview"}
					</h1>
					<p className="text-muted-foreground text-xs">
						Generated {new Date(data.generatedAt).toLocaleString()} · sha256{" "}
						<code>{data.hash}</code>
					</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" size="sm" onClick={() => setShowRaw(s => !s)}>
						{showRaw ? "Structured view" : "Raw XML"}
					</Button>
					<Button
						size="sm"
						onClick={download}
						disabled={hasErrors}
						title={hasErrors ? "Fix validation errors before downloading" : undefined}
					>
						Download
					</Button>
				</div>
			</header>

			{hasErrors ? (
				<div className="border-destructive/40 bg-destructive/5 rounded-md border p-3">
					<h2 className="text-destructive text-sm font-semibold">
						Validation errors — download blocked
					</h2>
					<ul className="text-destructive mt-1 flex flex-col gap-1 text-xs">
						{data.validationErrors.map((e, i) => (
							<li key={i}>
								<code>{e.code}</code> · {e.message}
							</li>
						))}
					</ul>
				</div>
			) : (
				<p className="text-muted-foreground text-xs">No validation errors.</p>
			)}

			{showRaw ? (
				<pre className="bg-muted overflow-x-auto rounded-md p-3 text-[11px] leading-relaxed">
					{data.xml}
				</pre>
			) : tree ? (
				<div className="bg-muted/40 rounded-md p-3 text-xs">
					<StructuredNode node={tree} />
				</div>
			) : (
				<p className="text-muted-foreground rounded-md border border-dashed p-3 text-xs italic">
					Could not parse XML for structured view. Toggle to Raw XML to inspect the source.
				</p>
			)}

			<section className="flex flex-col gap-2">
				<h2 className="text-sm font-semibold">Audit trail</h2>
				<p className="text-muted-foreground text-xs">
					Every export records who generated the XML and the file hash. Backend wiring
					arrives with CA-BE-12; until then these entries are mock.
				</p>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Action</TableHead>
							<TableHead>Actor</TableHead>
							<TableHead>At</TableHead>
							<TableHead>Hash</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{auditEntries.map(a => (
							<TableRow key={a.id}>
								<TableCell className="text-xs">{a.action}</TableCell>
								<TableCell className="text-xs">{a.actor}</TableCell>
								<TableCell className="text-xs tabular-nums">
									{a.at.toLocaleString()}
								</TableCell>
								<TableCell className="font-mono text-[10px]">{a.hash}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</section>
		</div>
	)
}
