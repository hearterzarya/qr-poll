import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HighwayBackground } from "@/components/highway/highway-background";
import { TrustBar } from "@/components/public/trust-bar";
import { PoleSafeLogo } from "@/components/shared/polesafe-logo";

export function CitizenShell({
  children,
  backHref,
  backLabel = "Back",
  showTrustBar = true,
}: {
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  showTrustBar?: boolean;
}) {
  return (
    <main className="relative isolate min-h-[100dvh] citizen-bg flex flex-col overflow-x-hidden">
      <HighwayBackground variant="citizen" />

      <header className="sticky top-0 z-50 glass-strong border-b border-border/50">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] -ml-2 pl-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">{backLabel}</span>
            </Link>
          ) : (
            <PoleSafeLogo size="sm" href="/" priority />
          )}
          <span className="label-micro text-[9px]">Highway Safety Network</span>
        </div>
        <div className="warning-strip opacity-40" />
      </header>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-5 pb-10 space-y-5 relative z-10">
        {children}
      </div>

      {showTrustBar && (
        <footer className="max-w-lg mx-auto w-full px-4 pb-8 relative z-10">
          <TrustBar />
        </footer>
      )}
    </main>
  );
}
