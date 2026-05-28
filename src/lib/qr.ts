import QRCode from "qrcode";

export function getPolePublicUrl(poleCode: string): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
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
