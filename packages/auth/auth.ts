// Wrapper consumed only by better-auth CLI (`pnpm auth:generate`).
// Not part of the package's public API — use @repo/auth (index.ts) in app code.
import { getAuth } from "./src/config.js"

export const auth = getAuth()
