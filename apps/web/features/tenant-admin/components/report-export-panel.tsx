"use client"

import { useState } from "react"

import { Button } from "@/core/components/ui/button"
import { Download, Loader2 } from "@/core/components/icons"

interface ReportExportPanelProps {
	onExportCsv?: () => void
	onExportPdf?: () => void
	csvLabel?: string
	pdfLabel?: string
}

export function ReportExportPanel({ onExportCsv, onExportPdf, csvLabel = "Export CSV", pdfLabel = "Export PDF" }: ReportExportPanelProps) {
	const [exporting, setExporting] = useState<"csv" | "pdf" | null>(null)

	async function handleCsv() {
		setExporting("csv")
		try { onExportCsv?.() } finally { setExporting(null) }
	}

	async function handlePdf() {
		setExporting("pdf")
		try { onExportPdf?.() } finally { setExporting(null) }
	}

	return (
		<div className="flex items-center gap-2">
			{onExportCsv && (
				<Button variant="outline" size="sm" onClick={handleCsv} disabled={exporting !== null} type="button">
					{exporting === "csv" ? <Loader2 className="mr-1.5 size-3.5" /> : <Download className="mr-1.5 size-3.5" />}
					{csvLabel}
				</Button>
			)}
			{onExportPdf && (
				<Button variant="outline" size="sm" onClick={handlePdf} disabled={exporting !== null} type="button">
					{exporting === "pdf" ? <Loader2 className="mr-1.5 size-3.5" /> : <Download className="mr-1.5 size-3.5" />}
					{pdfLabel}
				</Button>
			)}
		</div>
	)
}
