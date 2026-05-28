import { notFound } from "next/navigation";
import { getComplaintIcon } from "@/lib/category-icons";
import { prisma } from "@/lib/prisma";
import { COMPLAINT_CATEGORIES } from "@/lib/constants";
import { CitizenShell } from "@/components/public/citizen-shell";
import { ReportForm } from "@/components/forms/report-form";
import { HighwayRouteBadge } from "@/components/highway/highway-route-badge";

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ poleCode: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { poleCode } = await params;
  const { category: categoryParam } = await searchParams;

  const pole = await prisma.pole.findUnique({
    where: { poleCode: decodeURIComponent(poleCode) },
  });
  if (!pole) notFound();

  const category =
    categoryParam &&
    COMPLAINT_CATEGORIES.some((c) => c.id === categoryParam)
      ? categoryParam
      : "OTHER_COMPLAINT";

  const categoryLabel =
    COMPLAINT_CATEGORIES.find((c) => c.id === category)?.label ||
    "Other Complaint";

  const Icon = getComplaintIcon(category);

  return (
    <CitizenShell backHref={`/p/${pole.poleCode}`}>
      <div className="reflective-panel reflective-border rounded-2xl overflow-hidden">
        <div className="warning-strip" />
        <div className="p-4 flex items-center gap-4">
          <div className="rounded-xl bg-amber-500/15 border border-amber-500/30 p-3">
            <Icon className="h-7 w-7 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="label-micro">Report Issue</p>
            <h1 className="heading-executive text-lg text-foreground">
              {categoryLabel}
            </h1>
            <p className="font-mono text-xs text-primary mt-0.5">
              {pole.poleCode}
            </p>
          </div>
          <HighwayRouteBadge route={pole.highwayName} />
        </div>
      </div>

      <ReportForm
        poleCode={pole.poleCode}
        category={category}
        submitLabel="Submit Complaint"
      />
    </CitizenShell>
  );
}
