import { ClinicianLaunchProvider } from "@/features/clinician-shared/components/clinician-launch-provider"
import { ClinicianHeader } from "@/features/clinician-shared/components/clinician-header"

/**
 * Per CL-FE-01: minimal layout, conditional chrome.
 *
 * The (clinician) route group is designed to be embedded inside the EMR or accessed standalone.
 * ClinicianLaunchProvider detects the context and ClinicianHeader only renders if standalone.
 */
export default function ClinicianLayout({ children }: { children: React.ReactNode }) {
	return (
		<ClinicianLaunchProvider>
			<div className="bg-background text-foreground flex min-h-screen flex-col">
				<ClinicianHeader />
				<div className="flex flex-1 flex-col overflow-hidden">
					{children}
				</div>
			</div>
		</ClinicianLaunchProvider>
	)
}
