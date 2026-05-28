import { CitizenShell } from "@/components/public/citizen-shell";
import { ReportSuccessCard } from "@/components/highway/report-success-card";
import { EmergencyCTA } from "@/components/highway/emergency-cta";
import { EmergencyAlertCard } from "@/components/highway/emergency-alert-card";

export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ poleCode: string }>;
  searchParams: Promise<{ code?: string; priority?: string; emergency?: string }>;
}) {
  const { poleCode } = await params;
  const { code, priority, emergency } = await searchParams;
  const isEmergency = !!emergency;

  return (
    <CitizenShell backHref={`/p/${poleCode}`} showTrustBar>
      {isEmergency && (
        <EmergencyAlertCard
          description="If you are still in danger, call 112 immediately while teams respond."
        />
      )}

      {code ? (
        <ReportSuccessCard
          reportCode={code}
          priority={priority}
          isEmergency={isEmergency}
          poleCode={poleCode}
        />
      ) : (
        <p className="text-center text-muted-foreground">Report submitted.</p>
      )}

      {isEmergency && (
        <div className="pt-2">
          <p className="label-micro text-center mb-2">Direct helpline</p>
          <EmergencyCTA poleCode={poleCode} callsOnly />
        </div>
      )}
    </CitizenShell>
  );
}
