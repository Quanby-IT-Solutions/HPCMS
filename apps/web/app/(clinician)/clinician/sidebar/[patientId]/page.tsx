import { SidebarPageClient } from "@/features/clinician-sidebar/components/sidebar-page-client"

type Params = Promise<{ patientId: string }>

/**
 * Per CL-FE-04: this is the iframe-embedded sidebar. The 360-480px width cap
 * lives here (not on the parent layout) so the EMR iframe gets the compact
 * shell while the standalone fallback and design showcase remain unconstrained.
 *
 * When viewed standalone in a browser, the sidebar centers on the page so
 * developers can preview it; when embedded in the EMR, the surrounding
 * centered space is clipped by the iframe.
 */
export default async function ClinicianSidebarPage({ params }: { params: Params }) {
	const { patientId } = await params
	return (
		<div className="flex min-h-screen justify-center">
			<div className="w-full min-w-[360px] max-w-[480px]">
				<SidebarPageClient patientId={patientId} />
			</div>
		</div>
	)
}
