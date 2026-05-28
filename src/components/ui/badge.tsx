import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-primary/40 bg-primary/15 text-primary",
        secondary: "border-border bg-secondary text-secondary-foreground",
        outline: "border-border text-muted-foreground",
        p1: "border-red-500/50 bg-red-500/20 text-red-300 shadow-sm shadow-red-500/20",
        p2: "border-amber-500/50 bg-amber-500/20 text-amber-300",
        p3: "border-slate-500/40 bg-slate-500/15 text-slate-300",
        success: "border-green-500/50 bg-green-500/20 text-green-300",
        live: "border-red-500/50 bg-red-500/20 text-red-300 gap-1.5",
        verified:
          "border-cyan-500/50 bg-cyan-500/15 text-cyan-300 gap-1",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
