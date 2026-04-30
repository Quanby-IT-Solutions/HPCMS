/**
 * Typed route constants for the patient portal (PAT-FE-01).
 * Centralized so PortalHeader, dashboard, KB, chatbot, etc. share one source.
 */
export const PORTAL_ROUTES = {
	// public
	home: "/portal",
	login: "/portal/login",
	register: "/portal/register",
	mfa: "/portal/mfa",
	passwordReset: "/portal/password-reset",
	verifyEmail: "/portal/verify-email",
	welcome: "/portal/welcome",
	kb: "/portal/kb",
	kbArticle: (slug: string) => `/portal/kb/article/${slug}`,
	designShowcase: "/portal/design-showcase",

	// authenticated
	dashboard: "/portal/dashboard",
	verify: "/portal/verify",
	requests: "/portal/requests",
	requestDetail: (caseId: string) => `/portal/requests/${caseId}`,
	loaNew: "/portal/loa/new",
	loaConfirmation: (caseId: string) => `/portal/loa/${caseId}/confirmation`,
	chatbot: "/portal/chatbot",
	chat: "/portal/chat",
	chatThread: (threadId: string) => `/portal/chat/${threadId}`,
	notifications: "/portal/notifications",
	notificationDetail: (id: string) => `/portal/notifications/${id}`,
} as const
