export {
	createAuth,
	getAuth,
	authEnv,
	AUTH_BASE_PATH,
	configureAuthEmailCallbacks,
	type Auth,
} from "./config.js"
export type { Session, User, Account, Verification } from "better-auth/types"

export type AuthUser = {
	id: string
	name: string
	email: string
	emailVerified: boolean
	image?: string | null
	createdAt: Date
	updatedAt: Date
	role: string | null
	tenantId: string | null
}

/** Alias used by backend guards and decorators */
export type AuthSessionUser = AuthUser

export type AuthSession = {
	session: {
		id: string
		token: string
		expiresAt: Date
		userId: string
		ipAddress?: string | null
		userAgent?: string | null
		createdAt: Date
		updatedAt: Date
	}
	user: AuthUser
} | null
