import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAppBaseUrl } from "@/lib/app-url";
import { buildPoleQrResponse } from "@/lib/qr";
import { poleCodeParamSchema, qrFormatSchema, sanitizePoleCode } from "@/lib/validators";
import { handleApiError } from "@/lib/api-request";
import { apiNotFound } from "@/lib/api-response";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
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
      select: { poleCode: true, status: true },
    });

    if (!pole || pole.status === "INACTIVE") {
      return apiNotFound("Pole not found");
    }

    const formatParsed = qrFormatSchema.safeParse(
      Object.fromEntries(new URL(req.url).searchParams.entries()),
    );
    const format = formatParsed.success ? formatParsed.data : "png";
    const baseUrl = getAppBaseUrl(req.headers);

    return buildPoleQrResponse(pole.poleCode, format, baseUrl);
  } catch (err) {
    return handleApiError(err);
  }
}
