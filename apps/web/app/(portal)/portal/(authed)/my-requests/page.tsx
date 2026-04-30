import { permanentRedirect } from "next/navigation"

/**
 * Back-compat: previous URL was /portal/my-requests. Spec route is /portal/requests.
 */
export default function MyRequestsRedirect() {
	permanentRedirect("/portal/requests")
}
