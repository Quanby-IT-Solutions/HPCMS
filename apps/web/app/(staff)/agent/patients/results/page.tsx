import { PatientResultsList } from "@/features/agent-patients/components/patient-results-list"

interface Props {
	searchParams: Promise<{ q?: string }>
}

export default async function AgentPatientResultsPage({ searchParams }: Props) {
	const { q } = await searchParams
	return (
		<div className="flex flex-col gap-4">
			<header>
				<h1 className="text-2xl font-bold">Search results</h1>
				<p className="text-muted-foreground text-sm">Query: {q ? `“${q}”` : "—"}</p>
			</header>
			<PatientResultsList query={q ?? ""} />
		</div>
	)
}
