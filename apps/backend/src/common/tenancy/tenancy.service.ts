import { ForbiddenException, Injectable } from "@nestjs/common"
import { ClsService, type ClsStore } from "nestjs-cls"

interface TenancyClsStore extends ClsStore {
	tenantId?: string
	userId?: string
}

@Injectable()
export class TenancyService {
	constructor(private readonly cls: ClsService<TenancyClsStore>) {}

	getTenantId(): string | undefined {
		return this.cls.get("tenantId")
	}

	setTenantId(tenantId: string): void {
		this.cls.set("tenantId", tenantId)
	}

	getUserId(): string | undefined {
		return this.cls.get("userId")
	}

	setUserId(userId: string): void {
		this.cls.set("userId", userId)
	}

	assertTenant(): string {
		const tenantId = this.getTenantId()
		if (!tenantId) throw new ForbiddenException("No tenant in context")
		return tenantId
	}

	async runWithTenant<T>(tenantId: string, fn: () => Promise<T>): Promise<T> {
		return this.cls.runWith({ tenantId }, fn)
	}
}
