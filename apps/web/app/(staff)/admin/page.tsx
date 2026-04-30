import { redirect } from "next/navigation"

import { ADMIN_ROUTES } from "@/features/staff-admin/lib/admin-routes"

export default function AdminHomePage() {
	redirect(ADMIN_ROUTES.users)
}
