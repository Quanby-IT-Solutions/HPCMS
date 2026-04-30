import { oc } from "@orpc/contract"

import {
	MfaChallengeInputSchema,
	MfaChallengeOutputSchema,
	MfaEnableInputSchema,
	MfaEnableOutputSchema,
	MfaVerifyInputSchema,
	MfaVerifyOutputSchema,
	PasswordResetCompleteInputSchema,
	PasswordResetCompleteOutputSchema,
	PasswordResetRequestInputSchema,
	PasswordResetRequestOutputSchema,
	PasswordResetVerifyInputSchema,
	PasswordResetVerifyOutputSchema,
	RegistrationStartInputSchema,
	RegistrationStartOutputSchema,
	RegistrationVerifyInputSchema,
	RegistrationVerifyOutputSchema,
} from "./patient.schema.js"

export const patientPortalContract = {
	registration: {
		start: oc
			.route({
				method: "POST",
				path: "/patient/registration/start",
				summary: "Begin patient self-service registration; sends verification email",
				tags: ["Patient"],
			})
			.input(RegistrationStartInputSchema)
			.output(RegistrationStartOutputSchema),

		verify: oc
			.route({
				method: "POST",
				path: "/patient/registration/verify",
				summary: "Verify registration token; activates the patient account",
				tags: ["Patient"],
			})
			.input(RegistrationVerifyInputSchema)
			.output(RegistrationVerifyOutputSchema),
	},

	mfa: {
		challenge: oc
			.route({
				method: "POST",
				path: "/patient/mfa/challenge",
				summary: "Issue an MFA one-time code",
				tags: ["Patient"],
			})
			.input(MfaChallengeInputSchema)
			.output(MfaChallengeOutputSchema),

		verify: oc
			.route({
				method: "POST",
				path: "/patient/mfa/verify",
				summary: "Verify an MFA one-time code",
				tags: ["Patient"],
			})
			.input(MfaVerifyInputSchema)
			.output(MfaVerifyOutputSchema),

		enable: oc
			.route({
				method: "POST",
				path: "/patient/mfa/enable",
				summary: "Enable MFA on the current account",
				tags: ["Patient"],
			})
			.input(MfaEnableInputSchema)
			.output(MfaEnableOutputSchema),
	},

	passwordReset: {
		request: oc
			.route({
				method: "POST",
				path: "/patient/password-reset/request",
				summary: "Send a password reset email",
				tags: ["Patient"],
			})
			.input(PasswordResetRequestInputSchema)
			.output(PasswordResetRequestOutputSchema),

		verify: oc
			.route({
				method: "POST",
				path: "/patient/password-reset/verify",
				summary: "Verify reset token + identity (DOB or mobile OTP)",
				tags: ["Patient"],
			})
			.input(PasswordResetVerifyInputSchema)
			.output(PasswordResetVerifyOutputSchema),

		complete: oc
			.route({
				method: "POST",
				path: "/patient/password-reset/complete",
				summary: "Complete the password reset; invalidates existing sessions",
				tags: ["Patient"],
			})
			.input(PasswordResetCompleteInputSchema)
			.output(PasswordResetCompleteOutputSchema),
	},
}
