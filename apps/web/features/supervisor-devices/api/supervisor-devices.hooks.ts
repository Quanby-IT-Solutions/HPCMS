"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { DeviceDetail } from "@repo/contracts"

import { orpc } from "@/services/orpc/client"

export function usePatientDevicesQuery(patientId: string) {
	return useQuery({
		...orpc.devices.listForPatient.queryOptions({ input: { patientId } }),
		enabled: !!patientId,
		initialData: {
			devices: [
				{ deviceId: "dev-1", serialNumber: "SN-2026-001", deviceType: "Pulse Oximeter", status: "assigned" as const, assignmentDate: new Date("2026-03-01"), lastServiceDate: null },
				{ deviceId: "dev-2", serialNumber: "SN-2026-004", deviceType: "Blood Pressure Monitor", status: "in_use" as const, assignmentDate: new Date("2026-04-10"), lastServiceDate: new Date("2026-04-20") },
			],
		} as never,
		retry: false,
	})
}

export function useSupervisorDeviceAssignMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.supervisor.devices.assign.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.supervisor.devices.key() }),
		})
	)
}

export function useDeviceStatusUpdateMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.supervisor.devices.updateStatus.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.supervisor.devices.key() }),
		})
	)
}

export function useDeviceMaintenanceAddMutation() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.supervisor.devices.addMaintenance.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.supervisor.devices.key() }),
		})
	)
}

export function useDeviceDetailQuery(deviceId: string) {
	return useQuery({
		...orpc.supervisor.devices.get.queryOptions({ input: { deviceId } }),
		enabled: !!deviceId,
		initialData: {
			deviceId,
			serialNumber: "SN-2026-001",
			deviceType: "Pulse Oximeter",
			status: "assigned",
			patientId: "pat-1",
			patientName: "Maria Santos",
			caseRef: null,
			assignmentDate: new Date("2026-03-01"),
			lastServiceDate: null,
			maintenanceHistory: [],
		} as never,
		retry: false,
	})
}

export function useDeviceInventoryQuery(params: Record<string, unknown> = {}) {
	return useQuery({
		...orpc.supervisor.devices.inventory.queryOptions({ input: params }),
		initialData: {
			rows: [
				{ deviceId: "dev-1", serialNumber: "SN-2026-001", deviceType: "Pulse Oximeter", status: "assigned" as const, patientName: "Maria Santos", lastServiceDate: null },
				{ deviceId: "dev-2", serialNumber: "SN-2026-002", deviceType: "Blood Pressure Monitor", status: "in_use" as const, patientName: "Juan Dela Cruz", lastServiceDate: new Date("2026-02-15") },
				{ deviceId: "dev-3", serialNumber: "SN-2026-003", deviceType: "Glucometer", status: "returned" as const, patientName: null, lastServiceDate: null },
			],
			total: 3,
			page: 1,
			pageSize: 25,
		} as never,
		retry: false,
	})
}
