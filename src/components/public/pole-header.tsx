import { APP_TAGLINE } from "@/lib/constants";
import { PoleInfoCard } from "@/components/highway/pole-info-card";
import { QrScanTrustIndicator } from "@/components/highway/qr-scan-trust";
import { PoleSafeLogo } from "@/components/shared/polesafe-logo";

type Pole = {
  poleCode: string;
  highwayName: string;
  state: string;
  district: string;
  kmMarker: string;
  nearestLandmark?: string | null;
  authorityName?: string | null;
};

export function PoleHeader({
  pole,
  qrScanned = true,
}: {
  pole: Pole;
  qrScanned?: boolean;
}) {
  return (
    <header className="space-y-4">
      <div className="space-y-1">
        <PoleSafeLogo size="md" />
        <p className="text-xs text-muted-foreground">{APP_TAGLINE}</p>
      </div>
      <QrScanTrustIndicator scanned={qrScanned} />
      <PoleInfoCard pole={pole} showVerified />
    </header>
  );
}
