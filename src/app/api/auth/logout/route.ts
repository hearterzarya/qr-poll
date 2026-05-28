import { COOKIE_NAME_EXPORT } from "@/lib/auth";
import { apiSuccess } from "@/lib/api-response";

export async function POST() {
  const response = apiSuccess({ success: true });
  response.cookies.set(COOKIE_NAME_EXPORT, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
