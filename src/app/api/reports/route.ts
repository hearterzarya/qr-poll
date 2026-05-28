import { NextRequest } from "next/server";
import { createReportSchema, sanitizeDescription } from "@/lib/validators";
import {
  getClientIp,
  parseJsonBody,
  enforceRateLimit,
  handleApiError,
} from "@/lib/api-request";
import { apiSuccess, apiError } from "@/lib/api-response";
import { createReport } from "@/lib/reports";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limited = enforceRateLimit("REPORT_CREATE", ip);
    if (limited) return limited;

    const body = await parseJsonBody(req, createReportSchema);
    if (!body.success) return body.response;

    const data = body.data;
    const result = await createReport({
      poleCode: data.poleCode,
      category: data.category,
      emergencyType: data.emergencyType,
      description: sanitizeDescription(data.description),
      userPhone: data.userPhone,
      userLatitude: data.userLatitude,
      userLongitude: data.userLongitude,
      mediaUrls: data.mediaUrls,
      deviceInfo: data.deviceInfo,
      ipAddress: ip,
      isEmergency: data.isEmergency,
    });

    if ("error" in result) {
      return apiError(result.error, result.status);
    }

    return apiSuccess({
      reportCode: result.report.reportCode,
      priority: result.report.priority,
      status: result.report.status,
      isDuplicate: result.report.isDuplicate,
      trackUrl: `/track/${result.report.reportCode}`,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
