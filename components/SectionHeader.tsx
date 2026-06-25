import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function SectionHeader({
  title,
  subtitle,
  icon,
  href,
  hrefLabel = "View all",
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          {icon}
          {title}
        </h2>
        {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-medium text-gold hover:gap-2 transition-all shrink-0"
        >
          {hrefLabel} <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}
