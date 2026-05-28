import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { getAppBaseUrl } from "@/lib/app-url";

export function getPolePublicUrl(
  poleCode: string,
  baseUrl?: string,
): string {
  const base = baseUrl ?? getAppBaseUrl();
  return `${base.replace(/\/$/, "")}/p/${encodeURIComponent(poleCode)}`;
}

export async function generateQrPng(url: string): Promise<Buffer> {
  return QRCode.toBuffer(url, {
    type: "png",
    width: 512,
    margin: 2,
    color: { dark: "#07111F", light: "#FFFFFF" },
  });
}

export async function generateQrSvg(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: "svg",
    width: 512,
    margin: 2,
    color: { dark: "#07111F", light: "#FFFFFF" },
  });
}

export async function buildPoleQrResponse(
  poleCode: string,
  format: "png" | "svg",
  baseUrl?: string,
): Promise<NextResponse> {
  const url = getPolePublicUrl(poleCode, baseUrl);

  if (format === "svg") {
    const svg = await generateQrSvg(url);
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, must-revalidate",
        "Content-Disposition": `inline; filename="${poleCode}.svg"`,
        "X-QR-Target-Url": url,
      },
    });
  }

  const png = await generateQrPng(url);
  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600, must-revalidate",
      "Content-Disposition": `inline; filename="${poleCode}.png"`,
      "X-QR-Target-Url": url,
    },
  });
}
