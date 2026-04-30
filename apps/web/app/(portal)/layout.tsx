/**
 * The (portal) route group is split into:
 * - /portal/(public)/* — marketing landing, login, register, password-reset, KB, design-showcase
 * - /portal/(authed)/* — dashboard, requests, LOA, chat, notifications, etc.
 *
 * Each sub-shell handles its own auth requirement; this layout is a passthrough.
 */
export default function PortalGroupLayout({ children }: { children: React.ReactNode }) {
	return children
}
