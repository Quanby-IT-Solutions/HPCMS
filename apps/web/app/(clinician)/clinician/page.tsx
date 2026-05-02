"use client"

import { useClinicianContext } from "@/features/clinician-shared/components/clinician-launch-provider"
import { ClinicianDashboard } from "@/features/clinician-dashboard/components/clinician-dashboard"
import { PatientPanel } from "@/features/clinician-patient-panel/components/patient-panel"

export default function ClinicianHomePage() {
	const { patientId } = useClinicianContext()

	// If a patient context is loaded (via EMR SMART launch or standalone search),
	// render the Patient Case Panel.
	if (patientId) {
		return <PatientPanel />
	}

	// Otherwise, render the Clinician Dashboard overview.
	return <ClinicianDashboard />
}
