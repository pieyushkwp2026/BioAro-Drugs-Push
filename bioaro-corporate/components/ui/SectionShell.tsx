import { ReactNode } from "react";

export function SectionShell({
  id,
  label,
  title,
  description,
  className = "",
  align = "left",
  children,
}: {
  id?: string;
  label?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
  children: ReactNode;
}) {
  const centered = align === "center";

  return (
    <section id={id} className={`relative overflow-hidden py-24 md:py-36 ${className}`}>
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
          {label ? (
            <div
              className={`flex items-center gap-4 ${centered ? "justify-center" : ""}`}
            >
              <span className="h-px w-10 bg-gradient-to-r from-bioaro-blue/70 to-transparent" />
              <p className="font-mono text-[11px] uppercase tracking-[0.38em] text-bioaro-soft/80">
                {label}
              </p>
              {centered ? (
                <span className="h-px w-10 bg-gradient-to-l from-bioaro-blue/70 to-transparent" />
              ) : null}
            </div>
          ) : null}
          <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-5xl lg:text-[3.4rem]">
            {title}
          </h2>
          {description ? (
            <p
              className={`mt-6 text-base leading-8 text-bioaro-muted md:text-lg ${
                centered ? "mx-auto max-w-2xl" : "max-w-2xl"
              }`}
            >
              {description}
            </p>
          ) : null}
        </div>
        <div className="mt-14 md:mt-20">{children}</div>
      </div>
    </section>
  );
}
