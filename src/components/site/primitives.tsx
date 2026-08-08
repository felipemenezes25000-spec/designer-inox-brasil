import type { ReactNode } from "react";
import { useMagnetic } from "@/hooks/use-magnetic";

export function SectionShell({
  id,
  children,
  className = "",
}: {
  // `| undefined` explícito: SectionShell agora recebe id encaminhado de props
  // opcionais de outros componentes (ex.: ListSection), que sob
  // exactOptionalPropertyTypes chegam como string | undefined, não só ausentes.
  id?: string | undefined;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative border-t border-border ${className}`}>
      <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-14 2xl:px-20">
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  lead,
  align = "start",
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  align?: "start" | "between";
}) {
  return (
    <div
      className={`grid gap-8 ${
        align === "between" ? "lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end lg:gap-16" : ""
      }`}
    >
      <div className="min-w-0">
        <p className="reveal label-mono flex items-center gap-3" data-reveal>
          <span className="text-foreground">{index}</span>
          <span aria-hidden="true" className="h-px w-8 bg-border" />
          <span>{eyebrow}</span>
        </p>
        <h2
          className="reveal display mt-6 text-[clamp(2rem,5.2vw,4.75rem)]"
          data-reveal
          style={{ transitionDelay: "70ms" }}
        >
          {title}
        </h2>
      </div>
      {lead && (
        <p
          className="reveal max-w-xl text-base leading-relaxed text-muted-foreground lg:text-lg"
          data-reveal
          style={{ transitionDelay: "120ms" }}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

export function MagneticLink({
  href,
  children,
  variant = "solid",
  className = "",
  external = false,
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
  external?: boolean;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const ref = useMagnetic<HTMLAnchorElement>(6);
  return (
    <a
      ref={ref}
      href={href}
      className={`btn-base ${variant === "solid" ? "btn-solid" : "btn-ghost"} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}

export function Ticks({ count = 12 }: { count?: number }) {
  return (
    <div aria-hidden="true" className="flex flex-col justify-between">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="block h-px bg-border"
          style={{ width: i % 3 === 0 ? "1.25rem" : "0.5rem" }}
        />
      ))}
    </div>
  );
}
