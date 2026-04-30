/**
 * The (staff) route group is split into two sub-shells:
 * - /staff/admin/* uses the admin shell (system_admin / tenant_admin only)
 * - /agent/* uses the agent shell (case_agent / case_supervisor + admins)
 *
 * Each sub-shell is composed inside its own layout (see ./staff/layout.tsx and
 * ./agent/layout.tsx). This passthrough exists so the route group folder
 * itself doesn't need a different layout.
 */
export default function StaffGroupLayout({ children }: { children: React.ReactNode }) {
	return children
}
