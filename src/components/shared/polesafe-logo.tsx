import Link from "next/link";
import { cn } from "@/lib/utils";

export const LOGO_SRC = "/images/logo.png";

const sizes = {
  sm: "h-8 w-auto max-w-[150px]",
  md: "h-11 w-auto max-w-[200px]",
  lg: "h-16 w-auto max-w-[280px]",
  xl: "h-[88px] w-auto max-w-[340px]",
};

export function PoleSafeLogo({
  size = "md",
  className,
  href,
  priority = false,
}: {
  size?: keyof typeof sizes;
  className?: string;
  href?: string;
  priority?: boolean;
}) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
      alt="PoleSafe QR"
      width={320}
      height={88}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={cn("object-contain object-left", sizes[size], className)}
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
        {img}
      </Link>
    );
  }

  return img;
}
