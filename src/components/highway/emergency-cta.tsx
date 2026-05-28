import Link from "next/link";
import { AlertTriangle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HELPLINE_1033, HELPLINE_112 } from "@/lib/constants";
import { cn } from "@/lib/utils";

function CallButtons() {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <Button
        asChild
        variant="glass"
        size="lg"
        className="min-h-[58px] border-primary/25 toll-card"
      >
        <a href={`tel:${HELPLINE_1033}`}>
          <Phone className="h-4 w-4 text-primary shrink-0" />
          <span className="text-left leading-tight">
            <span className="label-micro block font-normal normal-case tracking-wide">
              Highway Helpline
            </span>
            <span className="font-bold text-lg">{HELPLINE_1033}</span>
          </span>
        </a>
      </Button>
      <Button asChild variant="destructive" size="lg" className="min-h-[58px]">
        <a href={`tel:${HELPLINE_112}`}>
          <Phone className="h-4 w-4 shrink-0" />
          <span className="text-left leading-tight">
            <span className="label-micro block opacity-90 font-normal normal-case">
              Emergency
            </span>
            <span className="font-bold text-lg">{HELPLINE_112}</span>
          </span>
        </a>
      </Button>
    </div>
  );
}

export function EmergencyCTA({
  poleCode,
  callsOnly = false,
  className,
}: {
  poleCode: string;
  callsOnly?: boolean;
  className?: string;
}) {
  if (callsOnly) {
    return (
      <div className={className}>
        <CallButtons />
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative rounded-2xl overflow-hidden reflective-border">
        <div className="warning-strip-red" />
        <Button
          asChild
          variant="emergency"
          size="xl"
          className="w-full flex-col gap-1 py-5 h-auto min-h-[76px] rounded-none rounded-b-2xl border-0"
        >
          <Link href={`/p/${poleCode}/emergency`}>
            <span className="flex items-center gap-2.5 text-lg">
              <AlertTriangle className="h-7 w-7" />
              REPORT EMERGENCY
            </span>
            <span className="text-xs font-normal opacity-90">
              One tap · Control room alerted
            </span>
          </Link>
        </Button>
      </div>
      <CallButtons />
    </div>
  );
}
