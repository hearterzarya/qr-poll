import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { MAX_UPLOAD_BYTES, ALLOWED_UPLOAD_TYPES } from "@/lib/constants";

export type UploadResult = {
  url: string;
  fileName: string;
  mediaType: "IMAGE" | "VIDEO";
};

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const EXTENSION_BY_MIME: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "video/mp4": [".mp4"],
  "video/quicktime": [".mov"],
};

export async function saveUpload(file: File): Promise<UploadResult> {
  const provider = process.env.UPLOAD_PROVIDER || "local";

  if (provider === "local") {
    return saveLocalUpload(file);
  }

  return saveLocalUpload(file);
}

async function saveLocalUpload(file: File): Promise<UploadResult> {
  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = getSafeExtension(file);
  const fileName = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join(UPLOAD_DIR, fileName);

  await writeFile(filePath, buffer);

  const mediaType = file.type.startsWith("video/") ? "VIDEO" : "IMAGE";

  return {
    url: `/uploads/${fileName}`,
    fileName: sanitizeOriginalName(file.name),
    mediaType,
  };
}

function getSafeExtension(file: File): string {
  const allowed = EXTENSION_BY_MIME[file.type];
  const ext = path.extname(file.name).toLowerCase();
  if (allowed?.includes(ext)) return ext;
  if (file.type === "image/jpeg") return ".jpg";
  if (file.type === "image/png") return ".png";
  if (file.type === "image/webp") return ".webp";
  if (file.type === "video/mp4") return ".mp4";
  if (file.type === "video/quicktime") return ".mov";
  return ".bin";
}

function sanitizeOriginalName(name: string): string {
  return path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 200);
}

export function validateUpload(file: File): string | null {
  if (!ALLOWED_UPLOAD_TYPES.includes(file.type)) {
    return "Invalid file type. Allowed: JPEG, PNG, WebP, MP4, MOV";
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return `File too large. Maximum size is ${MAX_UPLOAD_BYTES / (1024 * 1024)}MB`;
  }

  if (file.size === 0) {
    return "Empty file not allowed";
  }

  const ext = path.extname(file.name).toLowerCase();
  const allowedExts = EXTENSION_BY_MIME[file.type];
  if (allowedExts && ext && !allowedExts.includes(ext)) {
    return "File extension does not match file type";
  }

  return null;
}
