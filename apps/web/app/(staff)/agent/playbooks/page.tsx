"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/core/components/ui/card"
import { Skeleton } from "@/core/components/ui/skeleton"
import { usePlaybooksListQuery } from "@/features/agent-playbooks/api/playbooks.hooks"

export default function PlaybookLibraryPage() {
	const { data, isLoading } = usePlaybooksListQuery()

	return (
		<div className="flex flex-col gap-4">
			<header>
				<h1 className="text-2xl font-bold">Playbook library</h1>
				<p className="text-muted-foreground text-sm">
					Read-only view of the playbooks attached to each case type. Authoring lives in
					Supervisor (SUP-FE-14).
				</p>
			</header>
			{isLoading || !data ? (
				<Skeleton className="h-32 w-full" />
			) : (
				<div className="grid gap-3 md:grid-cols-2">
					{data.playbooks.map(p => (
						<Card key={p.key} size="sm">
							<CardHeader>
								<CardTitle>{p.name}</CardTitle>
								<CardDescription>
									Case type: <code>{p.caseType}</code> · {p.steps.length} steps
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ol className="text-muted-foreground list-decimal pl-4 text-xs">
									{p.steps.map(s => (
										<li key={s.stepNumber}>{s.title}</li>
									))}
								</ol>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	)
}
