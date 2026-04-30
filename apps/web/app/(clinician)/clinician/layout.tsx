/**
 * Per CL-FE-01: minimal layout, no chrome.
 *
 * The (clinician) route group is iframe-embedded inside the EMR. We must NOT
 * add navigation, sign-out, headers, or anything else that would compete with
 * the EMR's own chrome.
 *
 * The 360-480px width cap lives on the leaf routes that are actually embedded
 * (sidebar/[patientId], launch/error, callback/error) so the standalone
 * fallback page and design showcase can render at their natural width.
 */
export default function ClinicianLayout({ children }: { children: React.ReactNode }) {
	return <div className="bg-background text-foreground min-h-screen">{children}</div>
}
