import { permanentRedirect } from "next/navigation"

interface Props {
	params: Promise<{ ref: string }>
}

/**
 * Back-compat: previous URL was /portal/my-requests/[ref]. Spec is /portal/requests/[caseId].
 */
export default async function MyRequestDetailRedirect({ params }: Props) {
	const { ref } = await params
	permanentRedirect(`/portal/requests/${ref}`)
}
