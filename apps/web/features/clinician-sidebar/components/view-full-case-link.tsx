import { PopOutLink } from "@/features/clinician-sidebar/components/pop-out-link"

export function ViewFullCaseLink({ caseRef }: { caseRef: string }) {
	return (
		<PopOutLink to={`/staff/cases/${caseRef}`} caseRef={caseRef}>
			View full case
		</PopOutLink>
	)
}
