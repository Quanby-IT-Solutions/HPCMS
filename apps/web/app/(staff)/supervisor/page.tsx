import { redirect } from "next/navigation"

import { SUPERVISOR_ROUTES } from "./supervisor-routes"

export default function SupervisorHomePage() {
	redirect(SUPERVISOR_ROUTES.patients)
}
