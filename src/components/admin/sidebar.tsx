"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileWarning,
  MapPin,
  Users,
  LogOut,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PoleSafeLogo } from "@/components/shared/polesafe-logo";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/admin/dashboard", label: "Control Room", icon: LayoutDashboard },
  { href: "/admin/reports", label: "Reports", icon: FileWarning },
  { href: "/admin/poles", label: "Poles & QR", icon: MapPin },
  { href: "/admin/users", label: "Users", icon: Users, superOnly: true },
];

export function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="hidden lg:flex w-[268px] flex-col glass-strong border-r border-border min-h-screen relative z-20">
      <div className="p-5 border-b border-border">
        <PoleSafeLogo size="md" href="/admin/dashboard" className="mx-auto" />
        <p className="label-micro text-[9px] text-center mt-2">Highway Control Room</p>
        <Badge variant="live" className="mt-3 w-full justify-center py-1.5">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-red-400" />
          Live Monitoring
        </Badge>
        <p className="text-[11px] text-muted-foreground mt-2 text-center font-mono">
          {role.replace("_", " ")}
        </p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links
          .filter((l) => !l.superOnly || role === "SUPER_ADMIN")
          .map((link) => {
            const Icon = link.icon;
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all min-h-[48px]",
                  active
                    ? "bg-primary/15 text-primary border border-primary/25 shadow-sm shadow-primary/10"
                    : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                )}
              >
                <Icon className={cn("h-4 w-4", active && "text-primary")} />
                {link.label}
              </Link>
            );
          })}
      </nav>

      <div className="p-3 border-t border-border space-y-2">
        <div className="toll-card rounded-xl p-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Radio className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>Highway QR Network · Real-time</span>
        </div>
        <Separator />
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground min-h-[44px]"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
