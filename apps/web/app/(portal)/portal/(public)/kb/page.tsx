import { KbSearchPage } from "@/features/portal-kb/components/kb-search-page"

// useSearchParams in the client component needs dynamic rendering.
export const dynamic = "force-dynamic"

export default function PortalKbPage() {
	return <KbSearchPage />
}
