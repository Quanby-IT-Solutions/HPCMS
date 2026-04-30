import { z } from "zod"

const dateOrString = z
	.union([z.date(), z.string()])
	.transform(v => (typeof v === "string" ? new Date(v) : v))

// ============================================================================
// Registration (PAT-BE-02)
// ============================================================================

export const RegistrationStartInputSchema = z.object({
	fullName: z.string().min(1).max(200),
	email: z.string().email(),
	dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	mobilePhone: z.string().min(7).max(20),
	password: z.string().min(8).max(200),
	dataPrivacyActAcknowledged: z.literal(true),
	termsAccepted: z.literal(true),
})

export const RegistrationStartOutputSchema = z.object({
	pendingUserId: z.string(),
	emailVerificationSent: z.boolean(),
})

export const RegistrationVerifyInputSchema = z.object({
	token: z.string().min(1),
})

export const RegistrationVerifyOutputSchema = z.discriminatedUnion("outcome", [
	z.object({ outcome: z.literal("activated"), userId: z.string() }),
	z.object({ outcome: z.literal("expired") }),
	z.object({ outcome: z.literal("invalid") }),
])

// ============================================================================
// MFA (PAT-BE-03)
// ============================================================================

export const MfaChallengeInputSchema = z.object({
	email: z.string().email(),
})

export const MfaChallengeOutputSchema = z.object({
	challengeId: z.string(),
	expiresAt: dateOrString,
	resendAvailableAt: dateOrString,
})

export const MfaVerifyInputSchema = z.object({
	challengeId: z.string(),
	code: z.string().min(4).max(8),
})

export const MfaVerifyOutputSchema = z.discriminatedUnion("outcome", [
	z.object({ outcome: z.literal("ok") }),
	z.object({ outcome: z.literal("invalid"), attemptsRemaining: z.number().int() }),
	z.object({ outcome: z.literal("expired") }),
])

export const MfaEnableInputSchema = z.object({
	method: z.enum(["sms", "email", "totp"]),
})

export const MfaEnableOutputSchema = z.object({
	enabled: z.boolean(),
	totpSecret: z.string().nullable(),
})

// ============================================================================
// Password reset (PAT-BE-03)
// ============================================================================

export const PasswordResetRequestInputSchema = z.object({
	email: z.string().email(),
})

export const PasswordResetRequestOutputSchema = z.object({
	emailSent: z.boolean(),
})

export const PasswordResetVerifyInputSchema = z.object({
	token: z.string().min(1),
	dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
	mobileOtp: z.string().optional(),
})

export const PasswordResetVerifyOutputSchema = z.discriminatedUnion("outcome", [
	z.object({ outcome: z.literal("ok"), resetSessionId: z.string() }),
	z.object({ outcome: z.literal("expired") }),
	z.object({ outcome: z.literal("invalid") }),
	z.object({ outcome: z.literal("identity_failed"), attemptsRemaining: z.number().int() }),
])

export const PasswordResetCompleteInputSchema = z.object({
	resetSessionId: z.string(),
	newPassword: z.string().min(8).max(200),
})

export const PasswordResetCompleteOutputSchema = z.object({
	ok: z.literal(true),
})
