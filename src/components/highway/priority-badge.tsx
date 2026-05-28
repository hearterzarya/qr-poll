import { Badge } from "@/components/ui/badge";
import { priorityLabel } from "@/lib/priority-display";
import { cn } from "@/lib/utils";

export function PriorityBadge({
  priority,
  className,
}: {
  priority: string;
  className?: string;
}) {
  const variant =
    priority === "P1" ? "p1" : priority === "P2" ? "p2" : "p3";
  return (
    <Badge variant={variant} className={className}>
      {priority} · {priorityLabel(priority)}
    </Badge>
  );
}

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const colors: Record<string, string> = {
    NEW: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
    VERIFIED: "border-blue-500/40 bg-blue-500/10 text-blue-300",
    ASSIGNED: "border-amber-500/40 bg-amber-500/10 text-amber-300",
    IN_PROGRESS: "border-purple-500/40 bg-purple-500/10 text-purple-300",
    RESOLVED: "border-green-500/40 bg-green-500/10 text-green-300",
    REJECTED: "border-slate-500/40 bg-slate-500/10 text-slate-400",
    DUPLICATE: "border-slate-500/40 bg-slate-500/10 text-slate-400",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        colors[status] ?? colors.NEW,
        className,
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}
