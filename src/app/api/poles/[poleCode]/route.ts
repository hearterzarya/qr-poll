import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { poleCodeParamSchema, sanitizePoleCode } from "@/lib/validators";
import { handleApiError } from "@/lib/api-request";
import { apiSuccess, apiNotFound } from "@/lib/api-response";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ poleCode: string }> },
) {
  try {
    const raw = await params;
    const parsed = poleCodeParamSchema.safeParse({
      poleCode: sanitizePoleCode(raw.poleCode),
    });
    if (!parsed.success) {
      return apiNotFound("Pole not found");
    }

    const pole = await prisma.pole.findUnique({
      where: { poleCode: parsed.data.poleCode },
    });

    if (!pole || pole.status === "INACTIVE") {
      return apiNotFound("Pole not found");
    }

    return apiSuccess({
      id: pole.id,
      poleCode: pole.poleCode,
      highwayName: pole.highwayName,
      state: pole.state,
      district: pole.district,
      kmMarker: pole.kmMarker,
      latitude: pole.latitude,
      longitude: pole.longitude,
      nearestLandmark: pole.nearestLandmark,
      authorityName: pole.authorityName,
      contractorName: pole.contractorName,
      status: pole.status,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
