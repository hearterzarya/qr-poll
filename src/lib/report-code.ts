import { prisma } from "@/lib/prisma";

export async function generateReportCode(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `PS-${year}-`;

  const last = await prisma.report.findFirst({
    where: { reportCode: { startsWith: prefix } },
    orderBy: { reportCode: "desc" },
    select: { reportCode: true },
  });

  let nextNum = 1;
  if (last?.reportCode) {
    const parts = last.reportCode.split("-");
    const num = parseInt(parts[2] ?? "0", 10);
    if (!Number.isNaN(num)) nextNum = num + 1;
  }

  return `${prefix}${String(nextNum).padStart(6, "0")}`;
}
