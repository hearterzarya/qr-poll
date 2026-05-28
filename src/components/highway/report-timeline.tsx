import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Log = {
  id: string;
  newStatus: string;
  note?: string | null;
  createdAt: string | Date;
};

export function ReportTimeline({
  logs,
  className,
}: {
  logs: Log[];
  className?: string;
}) {
  if (logs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        No status updates yet.
      </p>
    );
  }

  return (
    <ol className={cn("space-y-0", className)}>
      {logs.map((log, i) => {
        const isLatest = i === logs.length - 1;
        const status = log.newStatus.replace("_", " ");
        return (
          <li key={log.id} className="relative pl-7 pb-6 last:pb-0">
            {i < logs.length - 1 && (
              <span className="absolute left-[9px] top-4 bottom-0 w-px bg-gradient-to-b from-primary/50 to-border" />
            )}
            <span
              className={cn(
                "absolute left-0 top-1.5 h-4 w-4 rounded-full border-2",
                isLatest
                  ? "border-primary bg-primary/30 shadow shadow-primary/40"
                  : "border-border bg-secondary",
              )}
            />
            <p className="label-micro text-primary/70">{status}</p>
            {log.note && (
              <p className="text-xs text-muted-foreground mt-1 border-l-2 border-amber-500/30 pl-2">
                {log.note}
              </p>
            )}
            <p className="text-[10px] text-muted-foreground/70 mt-1.5">
              {formatDate(
                typeof log.createdAt === "string"
                  ? log.createdAt
                  : log.createdAt.toISOString(),
              )}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
