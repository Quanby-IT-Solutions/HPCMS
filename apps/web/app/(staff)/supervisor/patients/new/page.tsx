import { Suspense } from "react"

import { PatientRegistrationForm } from "@/features/supervisor-patients/components/patient-registration-form"

export default function SupervisorPatientNewPage() {
	return (
		<Suspense>
			<PatientRegistrationForm />
		</Suspense>
	)
}
