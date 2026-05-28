"use client";

import { cn } from "@/lib/utils";

const BG_SRC = "/images/bg.png";

export function HighwayBackground({
  variant = "citizen",
  className,
  showImage = true,
}: {
  variant?: "citizen" | "admin";
  className?: string;
  showImage?: boolean;
}) {
  const isAdmin = variant === "admin";

  return (
    <div
      aria-hidden
      className={cn("absolute inset-0 z-0 overflow-hidden", className)}
    >
      {showImage && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BG_SRC}
            alt=""
            className={cn(
              "absolute inset-0 h-full w-full object-cover",
              isAdmin ? "object-[28%_center]" : "object-[left_center]",
            )}
          />
          {/* Light overlay — UI readable, highway photo still visible */}
          <div
            className={cn(
              "absolute inset-0",
              isAdmin
                ? "bg-[#07111F]/55"
                : "bg-gradient-to-b from-[#07111F]/45 via-[#07111F]/60 to-[#07111F]/80",
            )}
          />
        </>
      )}

      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          !isAdmin ? "lane-lines opacity-15" : "admin-grid-bg opacity-40",
        )}
      />
      {!isAdmin && (
        <div className="absolute inset-0 lane-lines-dashed opacity-[0.08] pointer-events-none" />
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isAdmin
            ? "radial-gradient(ellipse 60% 50% at 25% 50%, rgba(0,212,255,0.12), transparent 65%)"
            : "radial-gradient(ellipse 80% 60% at 20% 40%, rgba(0,212,255,0.1), transparent 60%)",
        }}
      />
    </div>
  );
}
