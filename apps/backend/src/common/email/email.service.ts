import * as fs from "node:fs/promises"
import * as path from "node:path"

import { Injectable, Logger, OnModuleInit } from "@nestjs/common"
import * as Handlebars from "handlebars"
import * as nodemailer from "nodemailer"
import type { Transporter } from "nodemailer"

import { env } from "@/config/env.config"

type TemplateName = "verification" | "reset-password" | "loa-submitted" | "loa-approved" | "loa-rejected"

const SUBJECTS: Record<TemplateName, string> = {
	"verification": "Verify your email address — HPCMS",
	"reset-password": "Reset your HPCMS password",
	"loa-submitted": "Your LOA request has been submitted",
	"loa-approved": "Your LOA request has been approved",
	"loa-rejected": "Your LOA request has been rejected",
}

@Injectable()
export class EmailService implements OnModuleInit {
	private readonly logger = new Logger(EmailService.name)
	private readonly transporter: Transporter
	private readonly compiled = new Map<TemplateName, HandlebarsTemplateDelegate>()

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: env.SMTP_HOST,
			port: env.SMTP_PORT,
			// Port 465 = implicit TLS; anything else = STARTTLS / plain (Mailpit uses plain)
			secure: env.SMTP_PORT === 465,
			...(env.SMTP_USER
				? { auth: { user: env.SMTP_USER, pass: env.SMTP_PASS } }
				: {}),
		})
	}

	async onModuleInit(): Promise<void> {
		const templatesDir = path.join(__dirname, "templates")
		const names: TemplateName[] = [
			"verification",
			"reset-password",
			"loa-submitted",
			"loa-approved",
			"loa-rejected",
		]
		for (const name of names) {
			const src = await fs.readFile(path.join(templatesDir, `${name}.hbs`), "utf-8")
			this.compiled.set(name, Handlebars.compile(src))
		}
		this.logger.log("Email templates loaded")
	}

	async send(template: TemplateName, to: string, vars: Record<string, unknown>): Promise<void> {
		try {
			const render = this.compiled.get(template)
			if (!render) {
				this.logger.warn(`Unknown email template: ${template}`)
				return
			}
			const html = render(vars)
			await this.transporter.sendMail({
				from: env.SMTP_FROM,
				to,
				subject: SUBJECTS[template],
				html,
			})
		} catch (err) {
			// Failures are logged but never thrown — notifications must never block mutations
			this.logger.error(`Failed to send email [template=${template} to=${to}]`, err)
		}
	}
}
