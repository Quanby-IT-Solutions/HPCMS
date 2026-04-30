"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { TrendAlert } from "@repo/contracts"

import { orpc } from "@/services/orpc/client"

export function useTrendAlertsQuery() {
	return useQuery({
		...orpc.supervisor.insights.listAlerts.queryOptions({ input: {} }),
		placeholderData: (): { alerts: TrendAlert[] } => ({
			alerts: [
				{
					alertId: "alert-1",
					title: "LOA Approval Delay Spike",
					alertType: "delay_spike",
					severity: "critical",
					affectedCaseRefs: ["LOA-2026-00128", "LOA-2026-00130", "LOA-2026-00131"],
					channelBreakdown: { HMO: 18, PhilHealth: 5 },
					lastUpdated: new Date("2026-04-30T06:00:00"),
					acknowledgedAt: null,
					acknowledgedBy: null,
					acknowledgeNote: null,
				},
				{
					alertId: "alert-2",
					title: "Billing Dispute Volume Increase",
					alertType: "volume_increase",
					severity: "warning",
					affectedCaseRefs: ["BILL-2026-00043", "BILL-2026-00044", "BILL-2026-00045"],
					channelBreakdown: { Outpatient: 31, Inpatient: 10 },
					lastUpdated: new Date("2026-04-29T12:00:00"),
					acknowledgedAt: null,
					acknowledgedBy: null,
					acknowledgeNote: null,
				},
				{
					alertId: "alert-3",
					title: "Complaint Resolution Time Improving",
					alertType: "positive_trend",
					severity: "info",
					affectedCaseRefs: ["COMP-2026-00007", "COMP-2026-00008"],
					channelBreakdown: { Complaints: 17 },
					lastUpdated: new Date("2026-04-30T04:30:00"),
					acknowledgedAt: new Date("2026-04-30T05:00:00"),
					acknowledgedBy: "supervisor@hpcms.local",
					acknowledgeNote: "Good progress — keep monitoring.",
				},
				{
					alertId: "alert-4",
					title: "Critical Escalation Cluster",
					alertType: "escalation_cluster",
					severity: "critical",
					affectedCaseRefs: ["COMP-2026-00010", "COMP-2026-00011", "COMP-2026-00012", "COMP-2026-00013"],
					channelBreakdown: { "Ward 3B": 4 },
					lastUpdated: new Date("2026-04-30T07:15:00"),
					acknowledgedAt: null,
					acknowledgedBy: null,
					acknowledgeNote: null,
				},
			],
		}),
	})
}

export function useAcknowledgeAlertMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.supervisor.insights.acknowledgeAlert.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.supervisor.insights.key() }),
		})
	)
}
