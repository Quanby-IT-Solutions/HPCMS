"use client"

import { createORPCClient } from "@orpc/client"
import type { ContractRouterClient } from "@orpc/contract"
import { OpenAPILink } from "@orpc/openapi-client/fetch"
import { createTanstackQueryUtils } from "@orpc/tanstack-query"

import { v1Contract, type V1Contract } from "@repo/contracts"

import { env } from "@/env"

function getBaseUrl() {
	return (env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api").replace(/\/$/, "")
}

let _tenantOverride: string | null = null

export function setTenantOverride(tenantId: string | null) {
	_tenantOverride = tenantId
}

export function getTenantOverride() {
	return _tenantOverride
}

const link = new OpenAPILink(v1Contract, {
	url: getBaseUrl(),
	fetch: (url, init) => {
		const headers = new Headers((init as RequestInit | undefined)?.headers)
		if (_tenantOverride) headers.set("x-tenant-id", _tenantOverride)
		return fetch(url, { ...init, headers, credentials: "include" })
	},
})

const baseOrpc = createORPCClient<ContractRouterClient<V1Contract>>(link)

export const orpc = createTanstackQueryUtils(baseOrpc)
