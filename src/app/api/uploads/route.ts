import { NextRequest } from "next/server";
import { saveUpload, validateUpload } from "@/lib/uploads";
import {
  getClientIp,
  enforceRateLimit,
  handleApiError,
} from "@/lib/api-request";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limited = enforceRateLimit("UPLOAD", ip);
    if (limited) return limited;

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return apiError("No file provided", 400);
    }

    const validationError = validateUpload(file);
    if (validationError) {
      return apiError(validationError, 400);
    }

    const result = await saveUpload(file);

    return apiSuccess({
      url: result.url,
      fileName: result.fileName,
      mediaType: result.mediaType,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
