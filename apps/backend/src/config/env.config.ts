import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
	server: {
		NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
		PORT: z.coerce.number().int().positive().default(3000),
		CORS_ORIGINS: z.string(),
		DATABASE_URL: z.string(),
		BETTER_AUTH_SECRET: z.string(),
		BETTER_AUTH_TRUSTED_ORIGINS: z.string(),
		GOOGLE_CLIENT_ID: z.string().optional(),
		GOOGLE_CLIENT_SECRET: z.string().optional(),
		S3_ENDPOINT: z.string(),
		S3_REGION: z.string().default("us-east-1"),
		S3_BUCKET: z.string(),
		S3_ACCESS_KEY_ID: z.string(),
		S3_SECRET_ACCESS_KEY: z.string(),
		S3_FORCE_PATH_STYLE: z.coerce.boolean().default(true),
		SMTP_HOST: z.string(),
		SMTP_PORT: z.coerce.number().int().positive().default(1025),
		SMTP_USER: z.string().optional(),
		SMTP_PASS: z.string().optional(),
		SMTP_FROM: z.string().email(),
		FHIR_MODE: z.enum(["stub", "altera"]).default("stub"),
		FHIR_BASE_URL: z.string().url().optional(),
		FHIR_CLIENT_ID: z.string().optional(),
		FHIR_CLIENT_SECRET: z.string().optional(),
		FHIR_CACHE_TTL_HOURS: z.coerce.number().int().positive().default(24),
		MRN_VERIFY_MAX_ATTEMPTS: z.coerce.number().int().positive().default(5),
		MRN_VERIFY_LOCKOUT_MINUTES: z.coerce.number().int().positive().default(15),
		WEB_APP_URL: z.string().url().default("http://localhost:3001"),
	},
	runtimeEnv: process.env,
	skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === "lint",
})

export type Env = typeof env
