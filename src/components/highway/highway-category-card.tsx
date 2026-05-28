"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { getComplaintIcon } from "@/lib/category-icons";
import { cn } from "@/lib/utils";

export function HighwayCategoryCard({
  href,
  label,
  categoryId,
  index = 0,
}: {
  href: string;
  label: string;
  categoryId: string;
  index?: number;
}) {
  const Icon = getComplaintIcon(categoryId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
    >
      <Link
        href={href}
        className={cn(
          "group relative flex min-h-[92px] flex-col justify-between rounded-xl overflow-hidden",
          "toll-card safety-edge p-3.5 transition-all",
          "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.98]",
        )}
      >
        <div className="absolute top-0 right-0 w-8 h-8 opacity-20">
          <div className="warning-strip rotate-45 translate-x-4 -translate-y-2 w-16" />
        </div>
        <div className="rounded-lg bg-amber-500/15 border border-amber-500/25 p-2 w-fit">
          <Icon className="h-5 w-5 text-amber-400" />
        </div>
        <div className="flex items-end justify-between gap-1 mt-2">
          <span className="text-xs font-semibold text-foreground leading-snug pr-1">
            {label}
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
        </div>
      </Link>
    </motion.div>
  );
}
