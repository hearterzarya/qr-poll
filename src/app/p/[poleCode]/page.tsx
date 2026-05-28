import Link from "next/link";
import { notFound } from "next/navigation";
import { Wrench } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CitizenShell } from "@/components/public/citizen-shell";
import { PoleHeader } from "@/components/public/pole-header";
import { EmergencyCTA } from "@/components/public/emergency-cta";
import { CategoryGrid } from "@/components/public/category-grid";
import { QrScanLogger } from "@/components/public/qr-scan-logger";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

async function getPole(poleCode: string) {
  return prisma.pole.findUnique({
    where: { poleCode: decodeURIComponent(poleCode) },
  });
}

export default async function PoleLandingPage({
  params,
}: {
  params: Promise<{ poleCode: string }>;
}) {
  const { poleCode } = await params;
  const pole = await getPole(poleCode);

  if (!pole || pole.status === "INACTIVE") notFound();

  return (
    <>
      <QrScanLogger poleCode={pole.poleCode} />
      <CitizenShell showTrustBar>
        <PoleHeader pole={pole} />
        <EmergencyCTA poleCode={pole.poleCode} />
        <Separator className="opacity-50" />
        <CategoryGrid poleCode={pole.poleCode} />
        <Button asChild variant="glass" size="lg" className="w-full min-h-[52px]">
          <Link href={`/p/${pole.poleCode}/report`}>
            <Wrench className="h-5 w-5" />
            Other Complaint
          </Link>
        </Button>
      </CitizenShell>
    </>
  );
}
