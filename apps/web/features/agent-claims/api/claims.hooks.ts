"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { ClaimHeader, ClaimLine, DrgRow, Payer } from "@repo/contracts"

import { orpc } from "@/services/orpc/client"

const MOCK_PAYERS: Payer[] = [
	{
		id: "payer-philhealth",
		name: "PhilHealth",
		code: "PHIC",
		contactEmail: null,
		createdAt: new Date("2024-01-01"),
	},
	{
		id: "payer-maxicare",
		name: "Maxicare",
		code: "MXC",
		contactEmail: "claims@maxicare.test",
		createdAt: new Date("2024-01-01"),
	},
	{
		id: "payer-medicard",
		name: "Medicard",
		code: "MDC",
		contactEmail: "ops@medicard.test",
		createdAt: new Date("2024-01-01"),
	},
]

function buildMockHeader(claimId: string): ClaimHeader {
	return {
		id: claimId,
		caseRef: "LOA-2026-00128",
		patientId: "patient-maria-santos",
		patientName: "Maria Santos",
		payerId: "payer-philhealth",
		payerName: "PhilHealth",
		coverageId: "cov-1",
		memberId: "PHIC-12-1234567-8",
		claimType: "loa",
		submissionDate: null,
		totalAmount: 28_500,
		approvedAmount: null,
		status: "draft",
		createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
	}
}

function buildMockLines(claimId: string): ClaimLine[] {
	return [
		{
			id: "ln-1",
			claimId,
			lineNumber: 1,
			codeSystem: "phic_cpt",
			code: "99213",
			description: "Office visit, established patient · level 3",
			quantity: 1,
			billedAmount: 1500,
			approvedAmount: null,
		},
		{
			id: "ln-2",
			claimId,
			lineNumber: 2,
			codeSystem: "phic_cpt",
			code: "82947",
			description: "Glucose, quantitative blood",
			quantity: 1,
			billedAmount: 250,
			approvedAmount: null,
		},
	]
}

function buildMockDrg(claimId: string) {
	return {
		diagnoses: [
			{
				id: "dx-1",
				claimId,
				rank: 1,
				codeSystem: "icd10" as const,
				code: "E11.9",
				description: "Type 2 diabetes mellitus without complications",
			},
		],
		procedures: [
			{
				id: "px-1",
				claimId,
				rank: 1,
				codeSystem: "phic_cpt" as const,
				code: "82947",
				description: "Glucose, quantitative blood",
			},
		],
	}
}

export function useClaimsListQuery() {
	return useQuery({
		...orpc.claims.headers.list.queryOptions({ input: { page: 1, limit: 25 } }),
		staleTime: 30 * 1000,
		placeholderData: () => ({
			headers: [
				buildMockHeader("claim-1"),
				{
					...buildMockHeader("claim-2"),
					id: "claim-2",
					caseRef: "LOA-2026-00131",
					patientName: "Ramon Cruz",
					patientId: "patient-ramon-cruz",
					payerId: "payer-maxicare",
					payerName: "Maxicare",
					status: "submitted" as const,
					submissionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
					totalAmount: 12_300,
				},
			],
			total: 2,
			page: 1,
			pageSize: 25,
		}),
	})
}

export function useClaimHeaderQuery(claimId: string) {
	return useQuery({
		...orpc.claims.headers.get.queryOptions({ input: { claimId } }),
		placeholderData: buildMockHeader(claimId),
	})
}

export function useClaimLinesQuery(claimId: string) {
	return useQuery({
		...orpc.claims.lines.list.queryOptions({ input: { claimId } }),
		placeholderData: { lines: buildMockLines(claimId) },
	})
}

export function useUpsertClaimHeaderMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.claims.headers.upsert.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.claims.headers.list.key() })
				queryClient.invalidateQueries({ queryKey: orpc.claims.headers.get.key() })
			},
		})
	)
}

export function useUpsertClaimLineMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.claims.lines.upsert.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.claims.lines.list.key() })
			},
		})
	)
}

export function useUpdateClaimStatusMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.claims.status.update.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.claims.headers.list.key() })
				queryClient.invalidateQueries({ queryKey: orpc.claims.headers.get.key() })
				queryClient.invalidateQueries({ queryKey: orpc.claims.dashboard.kpis.key() })
				queryClient.invalidateQueries({ queryKey: orpc.claims.aging.report.key() })
			},
		})
	)
}

export function useClaimsKpisQuery() {
	return useQuery({
		...orpc.claims.dashboard.kpis.queryOptions(),
		staleTime: 30 * 1000,
		placeholderData: {
			totalDraft: 4,
			totalSubmitted: 7,
			totalUnderReview: 3,
			totalApproved: 12,
			totalRejected: 1,
			totalPaid: 9,
			outstandingAmount: 184_500,
			slaBreaching: 2,
		},
	})
}

export function useAgingReportQuery() {
	return useQuery({
		...orpc.claims.aging.report.queryOptions(),
		staleTime: 30 * 1000,
		placeholderData: {
			buckets: [
				{ bucket: "0-30" as const, count: 8, totalAmount: 95_000 },
				{ bucket: "31-60" as const, count: 4, totalAmount: 52_000 },
				{ bucket: "61-90" as const, count: 2, totalAmount: 23_500 },
				{ bucket: "90+" as const, count: 1, totalAmount: 14_000 },
			],
			rows: [
				{
					claimId: "claim-2",
					caseRef: "LOA-2026-00131",
					patientName: "Ramon Cruz",
					payerName: "Maxicare",
					ageDays: 5,
					amount: 12_300,
					status: "submitted" as const,
				},
				{
					claimId: "claim-3",
					caseRef: "LOA-2026-00103",
					patientName: "Pedro Reyes",
					payerName: "PhilHealth",
					ageDays: 45,
					amount: 42_000,
					status: "under_review" as const,
				},
			],
		},
	})
}

export function useClaimDrgQuery(claimId: string) {
	return useQuery({
		...orpc.claims.drg.list.queryOptions({ input: { claimId } }),
		placeholderData: buildMockDrg(claimId),
	})
}

export function useReorderDrgMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.claims.drg.reorder.mutationOptions({
			onSuccess: () =>
				queryClient.invalidateQueries({ queryKey: orpc.claims.drg.list.key() }),
		})
	)
}

export function useUpsertDrgMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.claims.drg.upsert.mutationOptions({
			onSuccess: () =>
				queryClient.invalidateQueries({ queryKey: orpc.claims.drg.list.key() }),
		})
	)
}

export function usePayersListQuery() {
	return useQuery({
		...orpc.claims.payers.list.queryOptions(),
		staleTime: 60 * 1000,
		placeholderData: { payers: MOCK_PAYERS },
	})
}

export function useGenerateXmlMutation(kind: "cf5" | "esoa") {
	return useMutation(
		kind === "cf5"
			? orpc.claims.xml.cf5Generate.mutationOptions()
			: orpc.claims.xml.esoaGenerate.mutationOptions()
	)
}

export function useXmlPreviewQuery(claimId: string, enabled = true) {
	return useQuery({
		...orpc.claims.xml.preview.queryOptions({ input: { claimId } }),
		enabled,
		placeholderData: {
			claimId,
			xml: `<?xml version="1.0" encoding="UTF-8"?>\n<!-- Stub CF5 XML for ${claimId} -->\n<eClaim>\n  <ClaimDetails>\n    <ClaimNumber>${claimId}</ClaimNumber>\n  </ClaimDetails>\n</eClaim>`,
			hash: "stub-sha256-abcdef",
			generatedAt: new Date(),
			validationErrors: [],
		},
	})
}

export type { Payer, ClaimHeader, ClaimLine, DrgRow }
