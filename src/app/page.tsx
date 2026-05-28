import Link from "next/link";
import { QrCode, ArrowRight } from "lucide-react";
import { APP_TAGLINE } from "@/lib/constants";
import { PoleSafeLogo } from "@/components/shared/polesafe-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrustBar } from "@/components/public/trust-bar";
import { HighwayBackground } from "@/components/highway/highway-background";
import { VerifiedPoleBadge } from "@/components/highway/verified-pole-badge";

export default function HomePage() {
  return (
    <main className="relative isolate min-h-[100dvh] citizen-bg flex flex-col overflow-x-hidden">
      <HighwayBackground variant="citizen" />

      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto w-full text-center relative z-10">
        <VerifiedPoleBadge className="mb-6" />

        <PoleSafeLogo size="xl" className="mx-auto mb-4" priority />

        <p className="text-muted-foreground mt-1 max-w-sm text-base leading-relaxed">
          {APP_TAGLINE}
        </p>

        <div className="flex flex-col w-full gap-3 mt-10">
          <Button asChild size="xl" className="w-full min-h-[56px]">
            <Link href="/p/NH44-UP-AGRA-0001">
              <QrCode className="h-5 w-5" />
              Open Demo Help Point
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="glass" size="lg" className="w-full min-h-[52px]">
            <Link href="/admin/login">Control Room Login</Link>
          </Button>
        </div>

        <Card variant="glass" className="w-full mt-10 text-left reflective-border overflow-hidden">
          <div className="warning-strip opacity-50" />
          <CardContent className="p-4 grid grid-cols-3 gap-2 text-center">
            {[
              { v: "10K+", l: "Poles" },
              { v: "<2min", l: "Response" },
              { v: "24×7", l: "Monitoring" },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-lg font-bold text-primary heading-executive">{s.v}</p>
                <p className="label-micro">{s.l}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <footer className="w-full max-w-lg mx-auto px-6 pb-10 relative z-10">
        <TrustBar />
      </footer>
    </main>
  );
}
