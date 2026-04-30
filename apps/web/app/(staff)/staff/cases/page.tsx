import { permanentRedirect } from "next/navigation"

export default function StaffCasesRedirect() {
	permanentRedirect("/agent/cases")
}
