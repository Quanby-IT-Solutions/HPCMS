import { Module, OnModuleInit } from "@nestjs/common"

import { configureAuthEmailCallbacks } from "@repo/auth"

import { env } from "@/config/env.config"

import { EmailService } from "./email.service"

@Module({
	providers: [EmailService],
	exports: [EmailService],
})
export class EmailModule implements OnModuleInit {
	constructor(private readonly emailService: EmailService) {}

	onModuleInit(): void {
		// Wire Better Auth email hooks to the SMTP EmailService.
		// @repo/auth stays NestJS-free; it exposes a configureAuthEmailCallbacks()
		// function that stores callbacks in a module-level object captured by
		// reference inside the Better Auth hook closures.  By the time a user
		// request arrives the hooks are populated.
		configureAuthEmailCallbacks({
			sendVerificationEmail: async ({ user, token }) => {
				const url = `${env.WEB_APP_URL}/verify-email?token=${encodeURIComponent(token)}`
				await this.emailService.send("verification", user.email, {
					name: user.name,
					url,
				})
			},
			sendResetPassword: async ({ user, url }) => {
				await this.emailService.send("reset-password", user.email, {
					name: user.name,
					url,
				})
			},
		})
	}
}
