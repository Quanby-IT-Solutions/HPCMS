import { randomUUID } from "node:crypto"

import {
	GetObjectCommand,
	HeadObjectCommand,
	PutObjectCommand,
	S3Client,
	S3ServiceException,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { ForbiddenException, Injectable } from "@nestjs/common"

import { env } from "@/config/env.config"

const UPLOAD_TTL_SECONDS = 5 * 60
const DOWNLOAD_TTL_SECONDS = 5 * 60

export interface PresignUploadInput {
	tenantId: string
	caseId: string
	kind: string
	filename: string
	contentType: string
	sizeLimit: number
}

export interface PresignUploadResult {
	url: string
	key: string
	expiresAt: Date
}

export interface HeadResult {
	exists: boolean
	contentType?: string
	sizeBytes?: number
}

@Injectable()
export class StorageService {
	private readonly client: S3Client

	constructor() {
		this.client = new S3Client({
			endpoint: env.S3_ENDPOINT,
			region: env.S3_REGION,
			credentials: {
				accessKeyId: env.S3_ACCESS_KEY_ID,
				secretAccessKey: env.S3_SECRET_ACCESS_KEY,
			},
			forcePathStyle: env.S3_FORCE_PATH_STYLE,
		})
	}

	private sanitizeFilename(filename: string): string {
		return filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100)
	}

	buildKey(tenantId: string, caseId: string, filename: string): string {
		return `t/${tenantId}/c/${caseId}/${randomUUID()}-${this.sanitizeFilename(filename)}`
	}

	async presignUpload(input: PresignUploadInput): Promise<PresignUploadResult> {
		const key = this.buildKey(input.tenantId, input.caseId, input.filename)
		const command = new PutObjectCommand({
			Bucket: env.S3_BUCKET,
			Key: key,
			ContentType: input.contentType,
			ContentLength: input.sizeLimit,
		})
		const url = await getSignedUrl(this.client, command, { expiresIn: UPLOAD_TTL_SECONDS })
		return {
			url,
			key,
			expiresAt: new Date(Date.now() + UPLOAD_TTL_SECONDS * 1000),
		}
	}

	async presignDownload(tenantId: string, key: string): Promise<string> {
		if (!key.startsWith(`t/${tenantId}/`)) {
			throw new ForbiddenException("Access denied: key does not belong to the active tenant")
		}
		const command = new GetObjectCommand({ Bucket: env.S3_BUCKET, Key: key })
		return getSignedUrl(this.client, command, { expiresIn: DOWNLOAD_TTL_SECONDS })
	}

	async head(key: string): Promise<HeadResult> {
		try {
			const command = new HeadObjectCommand({ Bucket: env.S3_BUCKET, Key: key })
			const res = await this.client.send(command)
			return { exists: true, contentType: res.ContentType, sizeBytes: res.ContentLength }
		} catch (err) {
			if (err instanceof S3ServiceException && err.$metadata?.httpStatusCode === 404) {
				return { exists: false }
			}
			throw err
		}
	}
}
