import type { ReactNode } from "react";
import { Photo } from "./Photo";
import { Illustration } from "./Illustration";

export function PageHero({
  eyebrow,
  title,
  lead,
  photo,
  illustration,
  children,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  // `| undefined` explícito: com `exactOptionalPropertyTypes`, `photo?: string`
  // recusaria `service.photo`, que é `string | undefined` — 4 dos 13 serviços
  // não têm foto.
  photo?: string | undefined;
  /** Alternativa à foto: 4 serviços de sistema não têm foto, têm diagrama. */
  illustration?: string | undefined;
  children?: ReactNode | undefined;
}) {
  return (
    <section className="surface-dark relative border-t border-border">
      <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-14 2xl:px-20">
        <div className="grid gap-12 py-20 sm:py-28 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16 lg:py-32">
          <div className="min-w-0">
            <p className="reveal label-mono flex items-center gap-3" data-reveal>
              <span aria-hidden="true" className="h-px w-8 bg-border" />
              <span>{eyebrow}</span>
            </p>
            <h1
              className="reveal display mt-6 text-[clamp(2.25rem,5.5vw,4.5rem)]"
              data-reveal
              style={{ transitionDelay: "70ms" }}
            >
              {title}
            </h1>
            <p
              className="reveal mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg"
              data-reveal
              style={{ transitionDelay: "120ms" }}
            >
              {lead}
            </p>
            {children}
          </div>

          {photo && (
            <div className="reveal min-w-0" data-reveal style={{ transitionDelay: "160ms" }}>
              <Photo
                id={photo}
                priority
                className="aspect-[4/3] w-full"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </div>
          )}

          {!photo && illustration && (
            <div className="reveal min-w-0" data-reveal style={{ transitionDelay: "160ms" }}>
              <Illustration id={illustration} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
