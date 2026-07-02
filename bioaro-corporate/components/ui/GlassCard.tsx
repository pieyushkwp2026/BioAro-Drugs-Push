import { ReactNode } from "react";

export function GlassCard({
  children,
  className = "",
  lit = false,
}: {
  children: ReactNode;
  className?: string;
  lit?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[24px] border border-[rgba(0,183,255,0.1)] ${
        lit ? "bg-card-lit" : "bg-card-sheen"
      } shadow-ambient transition-all duration-500 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent ${className}`}
    >
      {children}
    </div>
  );
}
