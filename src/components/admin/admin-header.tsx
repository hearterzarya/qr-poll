"use client";

import { Badge } from "@/components/ui/badge";

export function AdminHeader({
  title,
  description,
  live = true,
  action,
}: {
  title: string;
  description?: string;
  live?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="heading-executive text-2xl lg:text-3xl text-foreground">
            {title}
          </h1>
          {live && (
            <Badge variant="live">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-red-400" />
              Live
            </Badge>
          )}
        </div>
        {description && (
          <p className="text-muted-foreground text-sm mt-1.5 max-w-xl">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
