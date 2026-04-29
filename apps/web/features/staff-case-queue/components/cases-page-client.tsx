"use client"

import { Suspense, useState } from "react"

import { CaseSidePanel } from "@/features/staff-case-detail/components/case-side-panel"
import { QueueFilters } from "./queue-filters"
import { QueueTable } from "./queue-table"
import { QueueTabs } from "./queue-tabs"

export function CasesPageClient() {
	const [selectedRef, setSelectedRef] = useState<string | null>(null)

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Case Queue</h1>
			</div>

			<Suspense>
				<QueueTabs />
			</Suspense>

			<Suspense>
				<QueueFilters />
			</Suspense>

			<div className="flex gap-4">
				<div className="min-w-0 flex-1">
					<Suspense>
						<QueueTable selectedRef={selectedRef} onSelectRef={setSelectedRef} />
					</Suspense>
				</div>

				{selectedRef && (
					<div className="w-[420px] shrink-0">
						<CaseSidePanel caseRef={selectedRef} mode="inline" onClose={() => setSelectedRef(null)} />
					</div>
				)}
			</div>
		</div>
	)
}
