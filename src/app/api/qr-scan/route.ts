import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { qrScanSchema, sanitizePoleCode } from "@/lib/validators";
import {
  getClientIp,
  parseJsonBody,
  enforceRateLimit,
  handleApiError,
} from "@/lib/api-request";
import { apiSuccess, apiNotFound } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limited = enforceRateLimit("QR_SCAN", ip);
    if (limited) return limited;

    const body = await parseJsonBody(req, qrScanSchema);
    if (!body.success) return body.response;

    const poleCode = sanitizePoleCode(body.data.poleCode);
    const pole = await prisma.pole.findUnique({
      where: { poleCode },
      select: { id: true, status: true },
    });

    if (!pole) {
      return apiNotFound("Pole not found");
    }

    const userAgent = req.headers.get("user-agent")?.slice(0, 500) || null;

    await prisma.qrScanLog.create({
      data: {
        poleId: pole.id,
        deviceHash: body.data.deviceHash,
        ipAddress: ip !== "unknown" ? ip : null,
        userAgent,
      },
    });

    return apiSuccess({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
