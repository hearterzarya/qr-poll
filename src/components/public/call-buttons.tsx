import { Phone } from "lucide-react";
import { HELPLINE_1033, HELPLINE_112 } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function CallButtons() {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <Button
        asChild
        variant="glass"
        size="lg"
        className="min-h-[56px] border-primary/20"
      >
        <a href={`tel:${HELPLINE_1033}`}>
          <Phone className="h-4 w-4 text-primary shrink-0" />
          <span className="text-left leading-tight">
            <span className="block text-[10px] text-muted-foreground font-normal">
              Highway Helpline
            </span>
            <span className="font-bold text-base">{HELPLINE_1033}</span>
          </span>
        </a>
      </Button>
      <Button asChild variant="destructive" size="lg" className="min-h-[56px]">
        <a href={`tel:${HELPLINE_112}`}>
          <Phone className="h-4 w-4 shrink-0" />
          <span className="text-left leading-tight">
            <span className="block text-[10px] opacity-80 font-normal">
              Emergency
            </span>
            <span className="font-bold text-base">{HELPLINE_112}</span>
          </span>
        </a>
      </Button>
    </div>
  );
}
