import { permanentRedirect } from "next/navigation"

interface CaseDetailRedirectProps {
	params: Promise<{ ref: string }>
}

export default async function StaffCaseDetailRedirect({ params }: CaseDetailRedirectProps) {
	const { ref } = await params
	permanentRedirect(`/agent/cases/${ref}`)
}
