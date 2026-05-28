import { cn } from "@/lib/utils";

export function KmMarkerBadge({
  km,
  className,
}: {
  km: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-stretch rounded overflow-hidden border border-green-600/50 font-mono text-sm font-bold shadow-sm",
        className,
      )}
    >
      <span className="bg-green-600 text-white px-2 py-1 text-[10px] uppercase tracking-wider flex items-center">
        KM
      </span>
      <span className="bg-[#102A4C] text-green-400 px-2.5 py-1 border-l border-green-600/30">
        {km}
      </span>
    </div>
  );
}
