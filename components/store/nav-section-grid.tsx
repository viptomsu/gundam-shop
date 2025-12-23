import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "./section-header";
import { cn } from "@/lib/utils";

export interface NavSectionItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  count: number;
}

interface NavSectionGridProps {
  title: string;
  viewAllHref: string;
  baseHref: string;
  items: NavSectionItem[];
  variant?: "default" | "brand";
  badgeLabel?: string;
  actionLabel?: string;
}

export function NavSectionGrid({
  title,
  viewAllHref,
  baseHref,
  items,
  variant = "default",
  badgeLabel = "ITEMS",
  actionLabel = "EXPLORE",
}: NavSectionGridProps) {
  const isBrand = variant === "brand";

  // Theme color classes based on variant
  const theme = {
    border: isBrand
      ? "from-accent/30 via-accent/10 to-accent/30"
      : "from-primary/30 via-primary/10 to-primary/30",
    hoverShadow: isBrand
      ? "hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]" // Assuming accent is gold-ish
      : "hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]",
    badgeText: isBrand ? "text-accent/70" : "text-primary/70",
    badgeBg: isBrand ? "bg-accent/10" : "bg-primary/10",
    titleHover: isBrand
      ? "group-hover:text-accent"
      : "group-hover:text-primary",
    actionHover: isBrand
      ? "text-accent/60 group-hover:text-accent"
      : "text-primary/60 group-hover:text-primary",
    cornerAccent: isBrand
      ? "text-accent/40 group-hover:text-accent"
      : "text-primary/40 group-hover:text-primary",
    gridPattern: isBrand
      ? "bg-[linear-gradient(rgba(255,215,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.1)_1px,transparent_1px)]"
      : "bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)]",
  };

  return (
    <section className="container px-4 md:px-6 py-12">
      <SectionHeader title={title} viewAllHref={viewAllHref} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.slice(0, 4).map((item) => (
          <Link key={item.id} href={`${baseHref}/${item.slug}`}>
            <div
              className={cn(
                "group relative h-48 overflow-hidden clip-mecha transition-all duration-300 hover:scale-[1.02]",
                theme.hoverShadow
              )}
            >
              {/* Border wrapper */}
              <div
                className={cn(
                  "absolute inset-0 bg-linear-to-br p-px clip-mecha",
                  theme.border
                )}
              >
                <div className="absolute inset-px bg-card clip-mecha" />
              </div>

              {/* Background Image / Logo */}
              {item.image && (
                <>
                  {isBrand ? (
                    <div className="absolute inset-0 flex items-center justify-center opacity-20 transition-all duration-500 group-hover:opacity-40">
                      <div
                        className="w-24 h-24 bg-contain bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                    </div>
                  ) : (
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-30 transition-all duration-500 group-hover:opacity-50 group-hover:scale-110"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                  )}
                </>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent z-10" />

              {/* Grid Pattern */}
              <div
                className={cn(
                  "absolute inset-0 opacity-10 bg-size-[20px_20px] z-10",
                  theme.gridPattern
                )}
              />

              {/* Content */}
              <div className="relative z-20 h-full p-5 flex flex-col justify-end">
                {/* Product Count Badge */}
                <div
                  className={cn(
                    "absolute top-4 right-4 font-mono text-[10px] px-2 py-1 clip-mecha-sm",
                    theme.badgeText,
                    theme.badgeBg
                  )}
                >
                  {item.count} {badgeLabel}
                </div>

                {/* Name */}
                <h3
                  className={cn(
                    "font-display text-xl font-bold uppercase tracking-wide transition-colors truncate",
                    theme.titleHover
                  )}
                >
                  {item.name}
                </h3>

                {/* Description */}
                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                    {item.description}
                  </p>
                )}

                {/* Action Indicator */}
                <div
                  className={cn(
                    "flex items-center gap-2 mt-3 transition-colors",
                    theme.actionHover
                  )}
                >
                  <div className="h-px w-6 bg-current transition-all duration-300 group-hover:w-10" />
                  <span className="font-mono text-[10px] tracking-widest">
                    {actionLabel}
                  </span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              {/* Corner Accents */}
              <svg
                className={cn(
                  "absolute top-2 left-2 w-4 h-4 transition-colors",
                  theme.cornerAccent
                )}
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M0 8 L0 0 L8 0" />
              </svg>
              <svg
                className={cn(
                  "absolute bottom-2 right-2 w-4 h-4 transition-colors",
                  theme.cornerAccent
                )}
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M16 8 L16 16 L8 16" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
