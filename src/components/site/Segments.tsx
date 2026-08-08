import { SectionShell, SectionHeading } from "./primitives";
import { segments } from "@/content/segments";
import { whatsapp } from "@/content/site";

export function Segments() {
  return (
    <SectionShell id="segmentos" className="py-20 sm:py-28 lg:py-36">
      <SectionHeading
        index="03"
        eyebrow="Contextos de operação"
        align="between"
        title={
          <>
            O mesmo aço.
            <span className="block text-titanium-fill pb-[0.06em]">Exigências diferentes.</span>
          </>
        }
        lead="Volume, fluxo, calor, higiene, carga e continuidade mudam conforme o segmento."
      />

      <ul className="mt-14 grid gap-px bg-border sm:grid-cols-2">
        {segments.map((s, i) => (
          <li
            key={s.slug}
            className="reveal specular group relative bg-background p-6 transition-colors duration-500 hover:bg-secondary/50 sm:p-10 lg:p-14"
            data-reveal
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            <p className="label-mono">Segmento {String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-6 max-w-md font-display text-[1.6rem] font-bold leading-[1.05] tracking-tight sm:text-3xl lg:text-[2.25rem]">
              {s.title}
            </h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              {s.short}
            </p>
            <a
              href={whatsapp(`Olá! Minha operação é: ${s.title}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="label-mono mt-8 inline-flex min-h-11 items-center gap-3 text-foreground transition-colors hover:text-signal"
            >
              Ver soluções para este segmento
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </a>
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-px w-0 bg-signal transition-all duration-700 group-hover:w-full"
            />
          </li>
        ))}
      </ul>

      <div className="reveal mt-10" data-reveal>
        <a
          href="/segmentos/"
          className="label-mono group inline-flex min-h-11 items-center gap-3 text-foreground transition-colors hover:text-signal"
        >
          Ver todos os segmentos
          <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
            →
          </span>
        </a>
      </div>
    </SectionShell>
  );
}
