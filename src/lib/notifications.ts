import {
  NotificationChannel,
  NotificationStatus,
  Report,
  Pole,
  ReportPriority,
} from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getGoogleMapsLink } from "@/lib/maps";

type ReportWithPole = Report & { pole: Pole };

async function logNotification(
  reportId: string,
  channel: NotificationChannel,
  recipient: string | null,
  message: string,
  status: NotificationStatus = NotificationStatus.SENT,
) {
  return prisma.notificationLog.create({
    data: { reportId, channel, recipient, message, status },
  });
}

function buildEmergencyMessage(report: ReportWithPole): string {
  const { pole } = report;
  const lat = report.userLatitude ?? pole.latitude;
  const lng = report.userLongitude ?? pole.longitude;

  return `🚨 HIGHWAY EMERGENCY ALERT

Report ID: ${report.reportCode}
Type: ${report.category}${report.emergencyType ? ` (${report.emergencyType})` : ""}
Priority: ${report.priority}
Pole: ${pole.poleCode}
Highway: ${pole.highwayName}
Location: KM ${pole.kmMarker}, ${pole.district}, ${pole.state}
Map: ${getGoogleMapsLink(lat, lng)}

Action Required: Immediate verification and dispatch.`;
}

function buildMaintenanceMessage(report: ReportWithPole): string {
  const { pole } = report;
  const lat = report.userLatitude ?? pole.latitude;
  const lng = report.userLongitude ?? pole.longitude;

  return `🛠️ Highway Maintenance Alert

Report ID: ${report.reportCode}
Category: ${report.category}
Priority: ${report.priority}
Pole: ${pole.poleCode}
Highway: ${pole.highwayName} | KM ${pole.kmMarker}
District: ${pole.district}, ${pole.state}
Map: ${getGoogleMapsLink(lat, lng)}

Please review and assign field team.`;
}

function buildStatusMessage(report: ReportWithPole, status: string): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";
  return `📋 Report Status Update

Report ID: ${report.reportCode}
New Status: ${status}
Pole: ${report.pole.poleCode}

Track: ${baseUrl}/track/${report.reportCode}`;
}

async function dispatch(
  report: ReportWithPole,
  message: string,
  recipient = "control-room@polesafe.in",
) {
  if (process.env.NODE_ENV === "development") {
    console.log("\n--- PoleSafe Notification ---");
    console.log(message);
    console.log("-------------------------------\n");
  }

  await logNotification(
    report.id,
    NotificationChannel.CONSOLE,
    recipient,
    message,
  );
}

export async function sendEmergencyAlert(report: ReportWithPole) {
  const message = buildEmergencyMessage(report);
  await dispatch(report, message);
}

export async function sendMaintenanceAlert(report: ReportWithPole) {
  const message = buildMaintenanceMessage(report);
  await dispatch(report, message);
}

export async function sendStatusUpdate(
  report: ReportWithPole,
  status: string,
) {
  const message = buildStatusMessage(report, status);
  await dispatch(report, message, "status-updates@polesafe.in");
}

/** Creates notification log for every new report (P1 = emergency, else maintenance). */
export async function notifyOnReportCreated(report: ReportWithPole) {
  if (report.priority === ReportPriority.P1) {
    await sendEmergencyAlert(report);
  } else {
    await sendMaintenanceAlert(report);
  }
}
