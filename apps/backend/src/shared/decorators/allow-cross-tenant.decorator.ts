import { SetMetadata } from "@nestjs/common"

export const ALLOW_CROSS_TENANT_KEY = "allowCrossTenant"

export const AllowCrossTenant = () => SetMetadata(ALLOW_CROSS_TENANT_KEY, true)
