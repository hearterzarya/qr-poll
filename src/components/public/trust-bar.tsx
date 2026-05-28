import { Building2, Shield, Smartphone, Zap } from "lucide-react";

const items = [
  { icon: Shield, label: "Authority Verified" },
  { icon: Zap, label: "Instant Alert" },
  { icon: Smartphone, label: "No App Needed" },
  { icon: Building2, label: "24×7 Control Room" },
];

export function TrustBar() {
  return (
    <div className="reflective-panel rounded-2xl p-4 border border-primary/10">
      <p className="label-micro text-center mb-3">
        Trusted Highway Safety Network
      </p>
      <div className="grid grid-cols-2 gap-3">
        {items.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <div className="rounded-lg bg-primary/10 border border-primary/20 p-1.5">
              <Icon className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
