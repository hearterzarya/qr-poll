import { cn } from "@/lib/utils";

/** Original route shield — not official NHAI branding */
export function HighwayRouteBadge({
  route,
  className,
}: {
  route: string;
  className?: string;
}) {
  const short = route.replace(/National Highway|NH/gi, "NH").slice(0, 12);

  return (
    <div
      className={cn(
        "inline-flex flex-col items-center justify-center min-w-[52px] rounded-md overflow-hidden border-2 border-amber-500/80 shadow-md",
        className,
      )}
      title={route}
    >
      <div className="w-full bg-amber-500 px-1.5 py-0.5">
        <span className="text-[9px] font-black text-[#07111F] uppercase tracking-tight block text-center">
          Route
        </span>
      </div>
      <div className="w-full bg-[#0B1F3A] px-2 py-1 border-t border-amber-500/30">
        <span className="text-xs font-bold text-amber-400 font-mono text-center block truncate max-w-[80px]">
          {short}
        </span>
      </div>
    </div>
  );
}
