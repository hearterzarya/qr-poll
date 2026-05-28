import { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { apiSuccess, apiUnauthorized } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  const user = await getSessionFromRequest(req);
  if (!user) {
    return apiUnauthorized();
  }
  return apiSuccess({ user });
}
