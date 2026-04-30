import { PatientSearchForm } from "@/features/agent-patients/components/patient-search-form"
import { RecentPatientsList } from "@/features/agent-patients/components/recent-patients-list"
import { RecentSearches } from "@/features/agent-patients/components/recent-searches"

export default function AgentPatientsPage() {
	return (
		<div className="flex flex-col gap-6">
			<header>
				<h1 className="text-2xl font-bold">Patients</h1>
				<p className="text-muted-foreground text-sm">
					Search by any identifier — name, DOB, MRN, contact, or HMO card.
				</p>
			</header>

			<section className="max-w-xl">
				<PatientSearchForm />
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
					Recent searches
				</h2>
				<RecentSearches />
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
					Recent patients
				</h2>
				<RecentPatientsList />
			</section>
		</div>
	)
}
