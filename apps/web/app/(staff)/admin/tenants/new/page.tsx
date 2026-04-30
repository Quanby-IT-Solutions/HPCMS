import { FacilityWizard } from "@/features/staff-admin/components/facility-wizard"

export default function NewFacilityPage() {
	return (
		<div className="max-w-2xl">
			<h1 className="text-2xl font-bold mb-6">New Facility</h1>
			<FacilityWizard />
		</div>
	)
}
