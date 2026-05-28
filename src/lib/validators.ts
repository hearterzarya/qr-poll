import { z } from "zod";
import { EMERGENCY_TYPES, COMPLAINT_CATEGORIES } from "@/lib/constants";

const emergencyIds = EMERGENCY_TYPES.map((e) => e.id) as [string, ...string[]];
const complaintIds = COMPLAINT_CATEGORIES.map((c) => c.id) as [
  string,
  ...string[],
];

export const cuidSchema = z.string().min(10).max(30);
export const poleCodeSchema = z
  .string()
  .min(3)
  .max(100)
  .regex(/^[A-Za-z0-9-]+$/, "Invalid pole code format");
export const reportCodeSchema = z
  .string()
  .min(8)
  .max(30)
  .regex(/^PS-\d{4}-\d{6}$/, "Invalid report code format");

export const coordinateSchema = z
  .number()
  .min(-90)
  .max(90)
  .optional()
  .nullable();

export const longitudeSchema = z
  .number()
  .min(-180)
  .max(180)
  .optional()
  .nullable();

export const phoneSchema = z
  .string()
  .max(20)
  .regex(/^[+\d\s()-]*$/, "Invalid phone number")
  .optional()
  .nullable();

export const mediaUrlSchema = z.object({
  url: z
    .string()
    .max(500)
    .refine(
      (url) => url.startsWith("/uploads/") && !url.includes(".."),
      "Invalid media URL",
    ),
  mediaType: z.enum(["IMAGE", "VIDEO"]),
  fileName: z.string().max(255).optional(),
});

export const reportStatusEnum = z.enum([
  "NEW",
  "VERIFIED",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "REJECTED",
  "DUPLICATE",
]);

export const reportPriorityEnum = z.enum(["P1", "P2", "P3"]);

export const poleStatusEnum = z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"]);

export const userRoleEnum = z.enum([
  "SUPER_ADMIN",
  "ADMIN",
  "CONTRACTOR",
  "FIELD_TEAM",
]);

export const loginSchema = z.object({
  email: z.string().email().max(255).transform((e) => e.toLowerCase().trim()),
  password: z.string().min(6).max(128),
});

export const createReportSchema = z
  .object({
    poleCode: poleCodeSchema,
    category: z.string().min(1).max(100),
    emergencyType: z.string().max(100).optional().nullable(),
    description: z.string().max(2000).optional().nullable(),
    userPhone: phoneSchema,
    userLatitude: coordinateSchema,
    userLongitude: longitudeSchema,
    mediaUrls: z.array(mediaUrlSchema).max(5).optional(),
    deviceInfo: z.string().max(500).optional().nullable(),
    isEmergency: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.isEmergency) {
      if (!emergencyIds.includes(data.category as (typeof emergencyIds)[number])) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid emergency category",
          path: ["category"],
        });
      }
    }
  });

export const updateReportStatusSchema = z.object({
  status: reportStatusEnum,
  note: z.string().max(2000).optional().nullable(),
});

export const assignReportSchema = z.object({
  assignedToId: cuidSchema,
});

export const addNoteSchema = z.object({
  note: z.string().min(1).max(2000),
});

export const poleSchema = z.object({
  poleCode: poleCodeSchema,
  highwayName: z.string().min(1).max(200).trim(),
  state: z.string().min(1).max(100).trim(),
  district: z.string().min(1).max(100).trim(),
  kmMarker: z.string().min(1).max(50).trim(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  nearestLandmark: z.string().max(300).optional().nullable(),
  authorityName: z.string().max(200).optional().nullable(),
  contractorName: z.string().max(200).optional().nullable(),
  status: poleStatusEnum.optional(),
});

export const createUserSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(255).transform((e) => e.toLowerCase().trim()),
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
  role: userRoleEnum,
  phone: phoneSchema,
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  role: userRoleEnum.optional(),
  phone: phoneSchema,
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const qrScanSchema = z.object({
  poleCode: poleCodeSchema,
  deviceHash: z
    .string()
    .max(100)
    .regex(/^[a-zA-Z0-9-]*$/)
    .optional(),
});

export const reportFiltersSchema = z.object({
  status: reportStatusEnum.optional(),
  priority: reportPriorityEnum.optional(),
  category: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  highway: z.string().max(200).optional(),
  search: z.string().max(100).optional(),
});

export const idParamSchema = z.object({
  id: cuidSchema,
});

export const poleCodeParamSchema = z.object({
  poleCode: poleCodeSchema,
});

export const reportCodeParamSchema = z.object({
  reportCode: reportCodeSchema,
});

export const qrFormatSchema = z.enum(["png", "svg"]).optional().default("png");

export function sanitizeDescription(text?: string | null): string | null {
  if (!text) return null;
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/[^\S\n]+/g, " ")
    .trim()
    .slice(0, 2000);
}

export function sanitizePoleCode(code: string): string {
  return decodeURIComponent(code).trim().toUpperCase();
}
