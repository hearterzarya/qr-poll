import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { idParamSchema, qrFormatSchema } from "@/lib/validators";
import { generateQrPng, generateQrSvg, getPolePublicUrl } from "@/lib/qr";
import { handleApiError } from "@/lib/api-request";
import { apiNotFound } from "@/lib/api-response";
import { ADMIN_READ_ROLES } from "@/lib/rbac";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuth(req, ADMIN_READ_ROLES);
    if ("error" in auth) return auth.error;

    const raw = await params;
    const idParsed = idParamSchema.safeParse(raw);
    if (!idParsed.success) {
      return apiNotFound("Pole not found");
    }

    const formatParsed = qrFormatSchema.safeParse(
      Object.fromEntries(new URL(req.url).searchParams.entries()),
    );
    const format = formatParsed.success ? formatParsed.data : "png";

    const pole = await prisma.pole.findUnique({
      where: { id: idParsed.data.id },
    });
    if (!pole) {
      return apiNotFound("Pole not found");
    }

    const url = getPolePublicUrl(pole.poleCode);

    if (format === "svg") {
      const svg = await generateQrSvg(url);
      return new NextResponse(svg, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Content-Disposition": `attachment; filename="${pole.poleCode}.svg"`,
        },
      });
    }

    const png = await generateQrPng(url);
    return new NextResponse(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="${pole.poleCode}.png"`,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
