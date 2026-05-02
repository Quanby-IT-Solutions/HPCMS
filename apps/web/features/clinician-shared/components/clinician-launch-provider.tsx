"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

type ClinicalContextType = {
	isEmbedded: boolean
	patientId: string | null
	practitionerId: string | null
	facilityId: string | null
	setPatientContext: (id: string | null) => void
}

const ClinicalLaunchContext = createContext<ClinicalContextType | undefined>(undefined)

export function ClinicianLaunchProvider({ children }: { children: React.ReactNode }) {
	const searchParams = useSearchParams()
	const [isEmbedded, setIsEmbedded] = useState<boolean>(false)
	const [patientId, setPatientId] = useState<string | null>(null)
	const [practitionerId, setPractitionerId] = useState<string | null>(null)
	const [facilityId, setFacilityId] = useState<string | null>(null)

	useEffect(() => {
		// Detect embedded mode (either via ?embedded=true or an active launch token)
		const embedded = searchParams.get("embedded") === "true" || !!searchParams.get("launch")
		setIsEmbedded(embedded)

		// Parse patient context (could be passed in via SMART context later, mocking via URL for now)
		const pid = searchParams.get("patient") || searchParams.get("patientId")
		if (pid) setPatientId(pid)

		const practId = searchParams.get("practitioner")
		if (practId) setPractitionerId(practId)

	}, [searchParams])

	return (
		<ClinicalLaunchContext.Provider
			value={{
				isEmbedded,
				patientId,
				practitionerId,
				facilityId,
				setPatientContext: setPatientId,
			}}
		>
			{children}
		</ClinicalLaunchContext.Provider>
	)
}

export function useClinicianContext() {
	const context = useContext(ClinicalLaunchContext)
	if (context === undefined) {
		throw new Error("useClinicianContext must be used within a ClinicianLaunchProvider")
	}
	return context
}
