import { oc } from "@orpc/contract"

import { attachmentsContract } from "./attachments/attachments.contract.js"
import { casesContract } from "./cases/cases.contract.js"
import { channelsContract } from "./channels/channels.contract.js"
import { chatbotContract } from "./chatbot/chatbot.contract.js"
import { claimsContract } from "./claims/claims.contract.js"
import { clinicianContract } from "./clinician/clinician.contract.js"
import { codesContract } from "./codes/codes.contract.js"
import { devicesContract } from "./devices/devices.contract.js"
import { v1Example } from "./examples/v1.example.js"
import { healthContract } from "./health/health.contract.js"
import { inboxContract } from "./inbox/inbox.contract.js"
import { kbContract } from "./kb/kb.contract.js"
import { notificationsContract } from "./notifications/notifications.contract.js"
import { outboundContract } from "./outbound/outbound.contract.js"
import { patientPortalContract } from "./patient/patient.contract.js"
import { patientsContract } from "./patients/patients.contract.js"
import { playbooksContract } from "./playbooks/playbooks.contract.js"
import { portalChatContract } from "./portalChat/portal-chat.contract.js"
import { practitionersContract } from "./practitioners/practitioners.contract.js"
import { programsContract } from "./programs/programs.contract.js"
import { staffAdminContract } from "./staff-admin/staff-admin.contract.js"
import { supervisorContract } from "./supervisor/supervisor.contract.js"
import { tenantAdminContract } from "./tenant-admin/tenant-admin.contract.js"
import { ticketContract } from "./tickets/tickets.contract.js"

/**
 * V1 contract router (versioned paths: /v1/todos, /v1/health, /v1/tickets)
 * Assembles all v1 feature contracts and applies the /v1 prefix
 */
export const v1Contract = oc.prefix("/v1").router(
	oc.router({
		health: healthContract,
		example: v1Example,
		ticket: ticketContract,
		patient: patientsContract,
		practitioner: practitionersContract,
		cases: casesContract,
		attachments: attachmentsContract,
		notifications: notificationsContract,
		staffAdmin: staffAdminContract,
		clinician: clinicianContract,
		inbox: inboxContract,
		channels: channelsContract,
		outbound: outboundContract,
		playbooks: playbooksContract,
		claims: claimsContract,
		codes: codesContract,
		programs: programsContract,
		devices: devicesContract,
		kb: kbContract,
		chatbot: chatbotContract,
		portalChat: portalChatContract,
		patientPortal: patientPortalContract,
		supervisor: supervisorContract,
		tenantAdmin: tenantAdminContract,
	})
)

export type V1Contract = typeof v1Contract
