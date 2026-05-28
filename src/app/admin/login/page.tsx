"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Radio } from "lucide-react";
import { toast } from "sonner";
import { PoleSafeLogo } from "@/components/shared/polesafe-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { HighwayBackground } from "@/components/highway/highway-background";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@polesafe.in");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Login failed");
      toast.error("Invalid credentials");
      return;
    }

    toast.success("Welcome to control room");
    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="relative isolate min-h-screen admin-bg flex items-center justify-center p-6 overflow-x-hidden">
      <HighwayBackground variant="admin" />
      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-3">
          <PoleSafeLogo size="lg" className="mx-auto" priority />
          <p className="label-micro normal-case tracking-wide">
            Highway Control Room · Authorized Access
          </p>
          <Badge variant="live" className="mx-auto">
            <Radio className="h-3 w-3" />
            Secure Login
          </Badge>
        </div>

        <Card variant="glass" className="shadow-2xl reflective-border overflow-hidden">
          <div className="warning-strip opacity-60" />
          <CardHeader>
            <CardTitle className="heading-executive">Sign in</CardTitle>
            <p className="text-xs text-muted-foreground">
              Highway authorities, contractors & field teams
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="label-micro">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 min-h-[48px]"
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <Label htmlFor="password" className="label-micro">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 min-h-[48px]"
                  required
                  autoComplete="current-password"
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full min-h-[50px]" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Enter Control Room
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-[11px] text-muted-foreground">
          Original highway safety platform · Not official government branding
        </p>
      </div>
    </main>
  );
}
